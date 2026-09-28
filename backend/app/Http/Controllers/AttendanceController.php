<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceRegularisation;
use App\Models\Holiday;
use App\Models\Profile;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * GET /api/attendance/status
     *
     * Returns the currently active check-in for the authenticated user, if any.
     * Checks if today is a holiday or weekend.
     */
    public function status(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Run daily maintenance guarded by a 10-minute cache lock
        $this->runDailyMaintenance($profile->id);

        $active = Attendance::forProfile($profile->id)
            ->active()
            ->latest('check_in_at')
            ->first();

        // Check if any record (active or completed/present/regularised) exists for today
        $todayRecord = $this->todayRecord($profile->id);
        $alreadyCompletedToday = !$active && $todayRecord && in_array($todayRecord->status, ['completed', 'present', 'regularised'], true);

        // Check if today is a Holiday or Sunday (weekly holiday)
        $todayDate = today()->toDateString();
        $todayHoliday = Holiday::whereDate('date', $todayDate)->first();
        $isWeekend = today()->isSunday();
        $isHoliday = (bool) $todayHoliday;

        $canCheckIn = !$isHoliday && !$isWeekend && !$active && !$alreadyCompletedToday;

        return response()->json([
            'success'                 => true,
            'data'                    => $active ? $this->formatAttendance($active) : null,
            'checked_in'              => (bool) $active,
            'already_completed_today' => (bool) $alreadyCompletedToday,
            'is_holiday'              => $isHoliday,
            'holiday'                 => $todayHoliday ? [
                'id'          => $todayHoliday->id,
                'title'       => $todayHoliday->title,
                'description' => $todayHoliday->description,
                'date'        => $todayHoliday->date?->format('Y-m-d'),
            ] : null,
            'is_weekend'              => $isWeekend,
            'can_check_in'            => $canCheckIn,
        ]);
    }

    /**
     * POST /api/attendance/check-in
     *
     * Creates a new attendance record for the authenticated user.
     * Rejects request if today is a Holiday or non-working day.
     */
    public function checkIn(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Check holiday / weekend policy
        $todayDate = today()->toDateString();
        $todayHoliday = Holiday::whereDate('date', $todayDate)->first();
        if ($todayHoliday) {
            return response()->json([
                'success' => false,
                'message' => "Check-in disabled: Today is a holiday ({$todayHoliday->title}).",
            ], 403);
        }

        if (today()->isSunday()) {
            return response()->json([
                'success' => false,
                'message' => 'Check-in disabled: Today is Sunday (weekly holiday).',
            ], 403);
        }

        // Auto-expire active check-ins from previous days
        $this->expireStaleActiveCheckIns($profile->id);

        // Prevent duplicate active check-ins
        $existing = Attendance::forProfile($profile->id)->active()->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You already have an active check-in. Please check out first.',
                'data'    => $this->formatAttendance($existing),
            ], 409);
        }

        // Prevent a second check-in on the same calendar day
        $todayRecord = $this->todayRecord($profile->id);
        if ($todayRecord) {
            return response()->json([
                'success' => false,
                'message' => 'You have already checked in today. Only one check-in is allowed per day.',
            ], 409);
        }

        $attendance = Attendance::create([
            'profile_id'  => $profile->id,
            'user_type'   => $profile->role, // 'student' or 'employee'
            'check_in_at' => now(),
            'status'      => 'active',
        ]);

        Log::info('User checked in', [
            'profile_id' => $profile->id,
            'role'       => $profile->role,
            'attendance' => $attendance->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Checked in successfully.',
            'data'    => $this->formatAttendance($attendance),
        ], 201);
    }

    /**
     * POST /api/attendance/check-out
     *
     * Closes the active attendance record, calculates total duration.
     */
    public function checkOut(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $attendance = Attendance::forProfile($profile->id)->active()->latest('check_in_at')->first();

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'No active check-in found. Please check in first.',
            ], 404);
        }

        $checkOutAt      = now();
        $durationMinutes = (int) $attendance->check_in_at->diffInMinutes($checkOutAt);

        $attendance->update([
            'check_out_at'           => $checkOutAt,
            'total_duration_minutes' => $durationMinutes,
            'status'                 => 'completed',
        ]);

        Log::info('User checked out', [
            'profile_id'       => $profile->id,
            'attendance'       => $attendance->id,
            'duration_minutes' => $durationMinutes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Checked out successfully.',
            'data'    => $this->formatAttendance($attendance->fresh()),
        ]);
    }

    /**
     * GET /api/admin/attendance
     *
     * List all attendance records for admin with filters and summary stats.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $this->runDailyMaintenance();

        $query = Attendance::with(['profile', 'timesheetEntries']);

        // Filter by search (user name/email)
        if ($search = $request->input('search')) {
            $query->whereHas('profile', function ($q) use ($search) {
                $q->search($search);
            });
        }

        // Filter by profile ID
        if ($profileId = $request->input('profile_id')) {
            $query->where('profile_id', $profileId);
        }

        // Filter by user type (role)
        if ($userType = $request->input('user_type') ?? $request->input('role')) {
            if ($userType !== 'all') {
                $query->where('user_type', $userType);
            }
        }

        // Filter by date range or exact date
        if ($date = $request->input('date')) {
            $query->whereBetween('check_in_at', [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()]);
        } else {
            if ($startDate = $request->input('start_date')) {
                $query->where('check_in_at', '>=', Carbon::parse($startDate)->startOfDay());
            }
            if ($endDate = $request->input('end_date')) {
                $query->where('check_in_at', '<=', Carbon::parse($endDate)->endOfDay());
            }
        }

        // Filter by status
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Calculate summary statistics
        $statsData = (clone $query)->reorder()->selectRaw("
            COUNT(*) as total_records,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
            COUNT(CASE WHEN status IN ('completed', 'present') THEN 1 END) as completed_count,
            COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
            COUNT(CASE WHEN status = 'regularised' THEN 1 END) as regularised_count,
            COUNT(CASE WHEN status = 'holiday' THEN 1 END) as holiday_count,
            SUM(CASE WHEN status IN ('completed', 'present', 'regularised') THEN total_duration_minutes ELSE 0 END) as total_minutes
        ")->first();

        $totalRecords     = (int) ($statsData->total_records ?? 0);
        $activeCount      = (int) ($statsData->active_count ?? 0);
        $completedCount   = (int) ($statsData->completed_count ?? 0);
        $absentCount      = (int) ($statsData->absent_count ?? 0);
        $regularisedCount = (int) ($statsData->regularised_count ?? 0);
        $holidayCount     = (int) ($statsData->holiday_count ?? 0);
        $totalMinutes     = (int) ($statsData->total_minutes ?? 0);

        $hours = intdiv($totalMinutes, 60);
        $mins  = $totalMinutes % 60;
        $totalHoursFormatted = sprintf('%dh %dmin', $hours, $mins);

        $query->orderBy('check_in_at', 'desc');

        $perPage     = min((int) $request->input('per_page', 15), 100);
        $attendances = $query->paginate($perPage);

        $items = collect($attendances->items())->map(function (Attendance $att) {
            $formatted = $this->formatAttendance($att);
            if ($att->relationLoaded('profile') && $att->profile) {
                $formatted['profile'] = [
                    'id'         => $att->profile->id,
                    'first_name' => $att->profile->first_name,
                    'last_name'  => $att->profile->last_name,
                    'full_name'  => $att->profile->full_name,
                    'email'      => $att->profile->email,
                    'role'       => $att->profile->role,
                    'avatar_url' => $att->profile->avatar_url,
                ];
            }
            if ($att->relationLoaded('timesheetEntries')) {
                $formatted['timesheet_entries'] = $att->timesheetEntries->map(function ($ts) {
                    return [
                        'id'               => $ts->id,
                        'attendance_id'    => $ts->attendance_id,
                        'profile_id'       => $ts->profile_id,
                        'task'             => $ts->task,
                        'task_description' => $ts->task_description,
                        'duration_minutes' => $ts->duration_minutes,
                        'duration_human'   => $ts->duration_human,
                        'created_at'       => $ts->created_at?->toISOString(),
                    ];
                });
            }
            return $formatted;
        });

        return response()->json([
            'success' => true,
            'data'    => $items,
            'stats'   => [
                'total_records'         => $totalRecords,
                'active_count'          => $activeCount,
                'completed_count'       => $completedCount,
                'absent_count'          => $absentCount,
                'regularised_count'     => $regularisedCount,
                'holiday_count'         => $holidayCount,
                'total_minutes'         => $totalMinutes,
                'total_hours_formatted' => $totalHoursFormatted,
            ],
            'meta'    => [
                'current_page' => $attendances->currentPage(),
                'last_page'    => $attendances->lastPage(),
                'per_page'     => $attendances->perPage(),
                'total'        => $attendances->total(),
                'from'         => $attendances->firstItem(),
                'to'           => $attendances->lastItem(),
            ],
        ]);
    }

    /**
     * GET /api/attendance/my-history
     *
     * List attendance records for the authenticated user (student/employee).
     */
    public function myHistory(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Run daily maintenance guarded by a 10-minute cache lock
        $this->runDailyMaintenance($profile->id);

        $query = Attendance::where('profile_id', $profile->id)
            ->with(['timesheetEntries'])
            ->orderBy('check_in_at', 'desc');

        if ($date = $request->input('date')) {
            $query->whereBetween('check_in_at', [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()]);
        } else {
            if ($startDate = $request->input('start_date')) {
                $query->where('check_in_at', '>=', Carbon::parse($startDate)->startOfDay());
            }
            if ($endDate = $request->input('end_date')) {
                $query->where('check_in_at', '<=', Carbon::parse($endDate)->endOfDay());
            }
        }

        $perPage     = min((int) $request->input('per_page', 15), 100);
        $attendances = $query->paginate($perPage);

        // Calculate personal statistics
        $statsData = Attendance::where('profile_id', $profile->id)->selectRaw("
            COUNT(*) as total_records,
            COUNT(CASE WHEN status IN ('completed', 'present') THEN 1 END) as completed_count,
            COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
            COUNT(CASE WHEN status = 'regularised' THEN 1 END) as regularised_count,
            COUNT(CASE WHEN status = 'holiday' THEN 1 END) as holiday_count,
            SUM(CASE WHEN status IN ('completed', 'present', 'regularised') THEN total_duration_minutes ELSE 0 END) as total_minutes
        ")->first();

        $totalRecords     = (int) ($statsData->total_records ?? 0);
        $completedCount   = (int) ($statsData->completed_count ?? 0);
        $absentCount      = (int) ($statsData->absent_count ?? 0);
        $regularisedCount = (int) ($statsData->regularised_count ?? 0);
        $holidayCount     = (int) ($statsData->holiday_count ?? 0);
        $totalMinutes     = (int) ($statsData->total_minutes ?? 0);

        $hours = intdiv($totalMinutes, 60);
        $mins  = $totalMinutes % 60;
        $totalHoursFormatted = sprintf('%dh %dmin', $hours, $mins);

        $items = collect($attendances->items())->map(function (Attendance $att) {
            $formatted = $this->formatAttendance($att);
            if ($att->relationLoaded('timesheetEntries')) {
                $formatted['timesheet_entries'] = $att->timesheetEntries->map(function ($ts) {
                    return [
                        'id'               => $ts->id,
                        'attendance_id'    => $ts->attendance_id,
                        'profile_id'       => $ts->profile_id,
                        'task'             => $ts->task,
                        'task_description' => $ts->task_description,
                        'duration_minutes' => $ts->duration_minutes,
                        'duration_human'   => $ts->duration_human,
                        'created_at'       => $ts->created_at?->toISOString(),
                    ];
                });
            }
            return $formatted;
        });

        return response()->json([
            'success' => true,
            'data'    => $items,
            'stats'   => [
                'total_records'         => $totalRecords,
                'completed_count'       => $completedCount,
                'absent_count'          => $absentCount,
                'regularised_count'     => $regularisedCount,
                'holiday_count'         => $holidayCount,
                'total_minutes'         => $totalMinutes,
                'total_hours_formatted' => $totalHoursFormatted,
            ],
            'meta'    => [
                'current_page' => $attendances->currentPage(),
                'last_page'    => $attendances->lastPage(),
                'per_page'     => $attendances->perPage(),
                'total'        => $attendances->total(),
                'from'         => $attendances->firstItem(),
                'to'           => $attendances->lastItem(),
            ],
        ]);
    }

    /**
     * GET /api/attendance/regularisations
     *
     * List regularisation requests submitted by the authenticated user.
     */
    public function getUserRegularisations(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $requests = AttendanceRegularisation::where('profile_id', $profile->id)
            ->with(['admin:id,first_name,last_name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($reg) {
                return [
                    'id'                       => $reg->id,
                    'attendance_id'            => $reg->attendance_id,
                    'profile_id'               => $reg->profile_id,
                    'date'                     => $reg->date?->format('Y-m-d'),
                    'requested_check_in_at'    => $reg->requested_check_in_at?->toISOString(),
                    'requested_check_out_at'   => $reg->requested_check_out_at?->toISOString(),
                    'requested_duration_human' => $reg->requested_duration_human,
                    'reason'                   => $reg->reason,
                    'status'                   => $reg->status,
                    'admin_remarks'            => $reg->admin_remarks,
                    'reviewed_at'              => $reg->reviewed_at?->toISOString(),
                    'created_at'               => $reg->created_at?->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $requests,
        ]);
    }

    /**
     * POST /api/attendance/regularisations
     *
     * Submit a regularisation request for an absent date.
     */
    public function storeRegularisation(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $validator = Validator::make($request->all(), [
            'date'           => 'required|date|before_or_equal:today',
            'check_in_time'  => 'required|string',
            'check_out_time' => 'required|string',
            'reason'         => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors'  => $validator->errors()->toArray(),
            ], 422);
        }

        $dateStr     = $request->input('date');
        $checkInRaw  = $request->input('check_in_time');
        $checkOutRaw = $request->input('check_out_time');

        try {
            $requestedCheckIn = str_contains($checkInRaw, 'T')
                ? Carbon::parse($checkInRaw)
                : Carbon::parse("{$dateStr} {$checkInRaw}");

            $requestedCheckOut = str_contains($checkOutRaw, 'T')
                ? Carbon::parse($checkOutRaw)
                : Carbon::parse("{$dateStr} {$checkOutRaw}");

            if ($requestedCheckOut->lte($requestedCheckIn)) {
                $requestedCheckOut->addDay();
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid check-in or check-out time format.',
            ], 422);
        }

        // Prevent duplicate pending request for the same date
        $existing = AttendanceRegularisation::where('profile_id', $profile->id)
            ->whereDate('date', $dateStr)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a pending regularisation request for this date.',
            ], 409);
        }

        // Check if an attendance record exists for that date
        $attendance = Attendance::where('profile_id', $profile->id)
            ->whereBetween('check_in_at', [Carbon::parse($dateStr)->startOfDay(), Carbon::parse($dateStr)->endOfDay()])
            ->first();

        $reg = AttendanceRegularisation::create([
            'attendance_id'          => $attendance?->id,
            'profile_id'             => $profile->id,
            'date'                   => $dateStr,
            'requested_check_in_at'  => $requestedCheckIn,
            'requested_check_out_at' => $requestedCheckOut,
            'reason'                 => $request->input('reason'),
            'status'                 => 'pending',
        ]);

        Log::info('Regularisation request submitted', [
            'profile_id' => $profile->id,
            'date'       => $dateStr,
            'id'         => $reg->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Regularisation request submitted successfully.',
            'data'    => $reg,
        ], 201);
    }

    /**
     * Run daily maintenance routines (auto-absent, expire stale check-ins, sync holidays)
     * guarded by a 10-minute cache lock per profile/global to eliminate redundant DB writes on GET hits.
     */
    private function runDailyMaintenance(?string $profileId = null): void
    {
        $key = 'att_maint_' . ($profileId ?? 'global') . '_' . today()->toDateString();

        if (!Cache::has($key)) {
            $this->expireStaleActiveCheckIns($profileId);
            $this->autoMarkAbsentWorkingDays($profileId);
            $this->syncHolidayAttendances($profileId);
            Cache::put($key, true, now()->addMinutes(10));
        }
    }

    /**
     * Auto-mark absent for active profiles for past working days where no check-in exists.
     * Skips weekends and holidays.
     * Optimized with bulk lookups & batch insert (1-2 SQL queries total instead of N*30 queries).
     */
    private function autoMarkAbsentWorkingDays(?string $profileId = null): void
    {
        $endDate   = today()->subDay(); // Up to yesterday
        $startDate = today()->subDays(30);

        if ($startDate->gt($endDate)) {
            return;
        }

        $profilesQuery = Profile::where('status', 'active')->whereIn('role', ['student', 'employee']);
        if ($profileId) {
            $profilesQuery->where('id', $profileId);
        }
        $profiles = $profilesQuery->get(['id', 'role', 'created_at']);

        if ($profiles->isEmpty()) {
            return;
        }

        $profileIds = $profiles->pluck('id')->all();

        // 1. Single query: Fetch existing check-in dates for these profiles in the 30-day window
        $existingRecords = Attendance::whereIn('profile_id', $profileIds)
            ->where('check_in_at', '>=', $startDate->copy()->startOfDay())
            ->where('check_in_at', '<=', $endDate->copy()->endOfDay())
            ->get(['profile_id', 'check_in_at']);

        $existingSet = [];
        foreach ($existingRecords as $rec) {
            if ($rec->check_in_at) {
                $existingSet[$rec->profile_id . '_' . $rec->check_in_at->format('Y-m-d')] = true;
            }
        }

        // 2. Fetch holiday dates in range
        $holidayDates = Holiday::whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->pluck('date')
            ->map(fn($d) => $d->format('Y-m-d'))
            ->toArray();
        $holidaySet = array_flip($holidayDates);

        $toInsert = [];
        $now = now();

        foreach ($profiles as $profile) {
            $profileStart = $profile->created_at ? $profile->created_at->startOfDay() : $startDate;
            $effectiveStart = $profileStart->gt($startDate) ? $profileStart : $startDate;

            if ($effectiveStart->gt($endDate)) {
                continue;
            }

            $period = CarbonPeriod::create($effectiveStart, $endDate);

            foreach ($period as $date) {
                if ($date->isSunday()) {
                    continue;
                }

                $dateStr = $date->toDateString();

                if (isset($holidaySet[$dateStr])) {
                    continue;
                }

                $key = $profile->id . '_' . $dateStr;
                if (!isset($existingSet[$key])) {
                    $toInsert[] = [
                        'id'          => (string) \Illuminate\Support\Str::uuid(),
                        'profile_id'  => $profile->id,
                        'user_type'   => $profile->role,
                        'check_in_at' => $date->copy()->setTime(9, 0, 0)->toDateTimeString(),
                        'status'      => 'absent',
                        'created_at'  => $now,
                        'updated_at'  => $now,
                    ];
                    $existingSet[$key] = true;
                }
            }
        }

        if (!empty($toInsert)) {
            foreach (array_chunk($toInsert, 500) as $chunk) {
                Attendance::insert($chunk);
            }
        }
    }

    /**
     * Synchronize existing attendance records on configured holiday dates.
     * Updates status from 'absent' or 'active' to 'holiday'.
     */
    private function syncHolidayAttendances(?string $profileId = null): void
    {
        try {
            $holidayDates = Holiday::pluck('date')->map(fn($d) => $d->format('Y-m-d'))->filter()->toArray();

            if (empty($holidayDates)) {
                return;
            }

            $query = Attendance::whereIn('status', ['absent', 'active'])
                ->where(function ($q) use ($holidayDates) {
                    foreach ($holidayDates as $hDate) {
                        $q->orWhereBetween('check_in_at', ["{$hDate} 00:00:00", "{$hDate} 23:59:59"]);
                    }
                });

            if ($profileId) {
                $query->where('profile_id', $profileId);
            }

            $query->update(['status' => 'holiday']);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::warning('Holiday attendance sync pending database constraint update.', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Auto-expire active check-ins whose check_in_at is prior to today.
     * Marks status = 'absent'.
     */
    private function expireStaleActiveCheckIns(?string $profileId = null): void
    {
        $query = Attendance::where('status', 'active')
            ->where('check_in_at', '<', today()->startOfDay());

        if ($profileId) {
            $query->where('profile_id', $profileId);
        }

        $query->update(['status' => 'absent']);
    }

    /**
     * Resolve the authenticated user's profile from request attributes.
     */
    private function getProfile(Request $request): Profile|JsonResponse
    {
        $profile = $request->attributes->get('auth_profile');

        if (!$profile) {
            $authUserId = $request->attributes->get('auth_user_id');

            if (!$authUserId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required.',
                ], 401);
            }

            $profile = Profile::where('auth_user_id', $authUserId)->first();
        }

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'User profile not found.',
            ], 404);
        }

        if (!in_array($profile->role, ['student', 'employee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance is only available for students and employees.',
            ], 403);
        }

        return $profile;
    }

    /**
     * Return any attendance record for today for a given profile.
     */
    private function todayRecord(string $profileId): ?Attendance
    {
        return Attendance::forProfile($profileId)
            ->whereBetween('check_in_at', [today()->startOfDay(), today()->endOfDay()])
            ->latest('check_in_at')
            ->first();
    }

    /**
     * Format an Attendance model for JSON output.
     */
    private function formatAttendance(Attendance $attendance): array
    {
        return [
            'id'                     => $attendance->id,
            'profile_id'             => $attendance->profile_id,
            'user_type'              => $attendance->user_type,
            'check_in_at'            => $attendance->check_in_at?->toISOString(),
            'check_out_at'           => $attendance->check_out_at?->toISOString(),
            'total_duration_minutes' => $attendance->total_duration_minutes,
            'total_duration_human'   => $attendance->total_duration_human,
            'status'                 => $attendance->status,
            'created_at'             => $attendance->created_at?->toISOString(),
            'updated_at'             => $attendance->updated_at?->toISOString(),
        ];
    }
}
