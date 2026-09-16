<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceRegularisation;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * GET /api/attendance/status
     *
     * Returns the currently active check-in for the authenticated user, if any.
     * Also signals whether the user has already completed their session today.
     * The frontend uses this on page load to restore the live timer.
     */
    public function status(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Auto-expire any active check-ins from previous days to 'absent'
        $this->expireStaleActiveCheckIns($profile->id);

        $active = Attendance::forProfile($profile->id)
            ->active()
            ->latest('check_in_at')
            ->first();

        // Check if any record (active or completed) exists for today
        $todayRecord = $this->todayRecord($profile->id);
        $alreadyCompletedToday = !$active && $todayRecord && $todayRecord->status === 'completed';

        return response()->json([
            'success'                 => true,
            'data'                    => $active ? $this->formatAttendance($active) : null,
            'checked_in'              => (bool) $active,
            'already_completed_today' => (bool) $alreadyCompletedToday,
        ]);
    }

    /**
     * POST /api/attendance/check-in
     *
     * Creates a new attendance record for the authenticated user.
     * Rejects the request if the user already has an active check-in
     * OR has already completed a session today.
     */
    public function checkIn(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Auto-expire any active check-ins from previous days to 'absent'
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
     * Returns 404 if no active check-in exists.
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

        $checkOutAt       = now();
        $durationMinutes  = (int) $attendance->check_in_at->diffInMinutes($checkOutAt);

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
     * List all attendance records for admin with user & date filters and summary stats.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        // Auto-expire active check-ins prior to today
        $this->expireStaleActiveCheckIns();

        $query = Attendance::with(['profile', 'timesheetEntries']);

        // Filter by user search (name or email)
        if ($search = $request->input('search')) {
            $query->whereHas('profile', function ($q) use ($search) {
                $q->search($search);
            });
        }

        // Filter by specific profile ID
        if ($profileId = $request->input('profile_id')) {
            $query->where('profile_id', $profileId);
        }

        // Filter by user type (role)
        if ($userType = $request->input('user_type') ?? $request->input('role')) {
            if ($userType !== 'all') {
                $query->where('user_type', $userType);
            }
        }

        // Filter by exact date
        if ($date = $request->input('date')) {
            $query->whereDate('check_in_at', $date);
        }

        // Filter by start_date
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('check_in_at', '>=', $startDate);
        }

        // Filter by end_date
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('check_in_at', '<=', $endDate);
        }

        // Filter by status
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Calculate summary statistics on the filtered query
        $statsQuery = clone $query;
        $totalRecords = (clone $statsQuery)->count();
        $activeCount = (clone $statsQuery)->where('status', 'active')->count();
        $completedCount = (clone $statsQuery)->where('status', 'completed')->count();
        $totalMinutes = (int) (clone $statsQuery)->where('status', 'completed')->sum('total_duration_minutes');

        $hours = intdiv($totalMinutes, 60);
        $mins = $totalMinutes % 60;
        $totalHoursFormatted = sprintf('%dh %dmin', $hours, $mins);

        // Newest check-ins first
        $query->orderBy('check_in_at', 'desc');

        $perPage = min((int) $request->input('per_page', 15), 100);
        $attendances = $query->paginate($perPage);

        // Format data
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

        // Auto-expire stale active check-ins
        $this->expireStaleActiveCheckIns($profile->id);

        $query = Attendance::where('profile_id', $profile->id)
            ->with(['timesheetEntries'])
            ->orderBy('check_in_at', 'desc');

        // Optional date filters
        if ($startDate = $request->input('start_date')) {
            $query->whereDate('check_in_at', '>=', $startDate);
        }
        if ($endDate = $request->input('end_date')) {
            $query->whereDate('check_in_at', '<=', $endDate);
        }
        if ($date = $request->input('date')) {
            $query->whereDate('check_in_at', $date);
        }

        $perPage = min((int) $request->input('per_page', 15), 100);
        $attendances = $query->paginate($perPage);

        // Calculate personal statistics
        $totalRecords = Attendance::where('profile_id', $profile->id)->count();
        $completedCount = Attendance::where('profile_id', $profile->id)->whereIn('status', ['completed', 'present'])->count();
        $absentCount = Attendance::where('profile_id', $profile->id)->where('status', 'absent')->count();
        $totalMinutes = (int) Attendance::where('profile_id', $profile->id)->whereIn('status', ['completed', 'present'])->sum('total_duration_minutes');

        $hours = intdiv($totalMinutes, 60);
        $mins = $totalMinutes % 60;
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
            ->with(['admin'])
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

        $dateStr = $request->input('date');
        $checkInRaw = $request->input('check_in_time');
        $checkOutRaw = $request->input('check_out_time');

        // Parse datetime strings
        try {
            $requestedCheckIn = str_contains($checkInRaw, 'T')
                ? \Carbon\Carbon::parse($checkInRaw)
                : \Carbon\Carbon::parse("{$dateStr} {$checkInRaw}");

            $requestedCheckOut = str_contains($checkOutRaw, 'T')
                ? \Carbon\Carbon::parse($checkOutRaw)
                : \Carbon\Carbon::parse("{$dateStr} {$checkOutRaw}");

            if ($requestedCheckOut->lte($requestedCheckIn)) {
                // If check-out is before check-in, assume next day check-out
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

        // Check if an attendance record exists for that date (e.g. status = 'absent')
        $attendance = Attendance::where('profile_id', $profile->id)
            ->whereDate('check_in_at', $dateStr)
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

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Auto-expire active check-ins whose check_in_at is prior to today.
     * Marks status = 'absent'.
     */
    private function expireStaleActiveCheckIns(?string $profileId = null): void
    {
        $query = Attendance::where('status', 'active')
            ->whereDate('check_in_at', '<', today());

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
        $authUserId = $request->attributes->get('auth_user_id');

        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        }

        $profile = Profile::where('auth_user_id', $authUserId)->first();

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
     * Return any attendance record (active or completed) for today for a given profile.
     * Uses the server's local date (DATE() in PostgreSQL).
     */
    private function todayRecord(string $profileId): ?Attendance
    {
        return Attendance::forProfile($profileId)
            ->whereDate('check_in_at', today())
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
