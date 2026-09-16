<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceRegularisation;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminRegularisationController extends Controller
{
    /**
     * GET /api/admin/regularisations
     *
     * List regularisation requests for admin with filters and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AttendanceRegularisation::with(['profile', 'attendance', 'admin']);

        // Filter by status ('pending', 'approved', 'rejected')
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Filter by user search (name, email)
        if ($search = $request->input('search')) {
            $query->whereHas('profile', function ($q) use ($search) {
                $q->search($search);
            });
        }

        // Filter by role ('student', 'employee')
        if ($role = $request->input('role') ?? $request->input('user_type')) {
            if ($role !== 'all') {
                $query->whereHas('profile', function ($q) use ($role) {
                    $q->where('role', $role);
                });
            }
        }

        // Filter by date
        if ($date = $request->input('date')) {
            $query->whereDate('date', $date);
        }

        $query->orderBy('created_at', 'desc');

        $perPage = min((int) $request->input('per_page', 15), 100);
        $requests = $query->paginate($perPage);

        $items = collect($requests->items())->map(function (AttendanceRegularisation $reg) {
            return $this->formatRegularisation($reg);
        });

        return response()->json([
            'success' => true,
            'data'    => $items,
            'meta'    => [
                'current_page' => $requests->currentPage(),
                'last_page'    => $requests->lastPage(),
                'per_page'     => $requests->perPage(),
                'total'        => $requests->total(),
                'from'         => $requests->firstItem(),
                'to'           => $requests->lastItem(),
            ],
        ]);
    }

    /**
     * POST /api/admin/regularisations/{id}/approve
     *
     * Approve a regularisation request, update attendance from absent to completed/present.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        $adminProfile = $request->attributes->get('admin_profile');

        $reg = AttendanceRegularisation::with('profile')->find($id);
        if (!$reg) {
            return response()->json([
                'success' => false,
                'message' => 'Regularisation request not found.',
            ], 404);
        }

        if ($reg->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'This request has already been approved.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // 1. Calculate duration in minutes
            $checkInAt  = $reg->requested_check_in_at;
            $checkOutAt = $reg->requested_check_out_at;
            $duration   = (int) $checkInAt->diffInMinutes($checkOutAt);

            // 2. Find or create Attendance record
            $attendance = null;
            if ($reg->attendance_id) {
                $attendance = Attendance::find($reg->attendance_id);
            }

            if (!$attendance) {
                $attendance = Attendance::where('profile_id', $reg->profile_id)
                    ->whereDate('check_in_at', $reg->date)
                    ->first();
            }

            if ($attendance) {
                $attendance->update([
                    'check_in_at'            => $checkInAt,
                    'check_out_at'           => $checkOutAt,
                    'total_duration_minutes' => $duration,
                    'status'                 => 'completed',
                ]);
            } else {
                $attendance = Attendance::create([
                    'profile_id'             => $reg->profile_id,
                    'user_type'              => $reg->profile->role,
                    'check_in_at'            => $checkInAt,
                    'check_out_at'           => $checkOutAt,
                    'total_duration_minutes' => $duration,
                    'status'                 => 'completed',
                ]);
            }

            // 3. Update Regularisation record
            $reg->update([
                'attendance_id' => $attendance->id,
                'status'        => 'approved',
                'admin_id'      => $adminProfile ? $adminProfile->id : null,
                'reviewed_at'   => now(),
            ]);

            DB::commit();

            Log::info('Regularisation approved by admin', [
                'regularisation_id' => $reg->id,
                'admin_id'          => $adminProfile ? $adminProfile->id : null,
                'attendance_id'     => $attendance->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Regularisation request approved successfully.',
                'data'    => $this->formatRegularisation($reg->fresh(['profile', 'attendance', 'admin'])),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve regularisation: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/admin/regularisations/{id}/reject
     *
     * Reject a regularisation request with optional admin remarks.
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        $adminProfile = $request->attributes->get('admin_profile');

        $reg = AttendanceRegularisation::with('profile')->find($id);
        if (!$reg) {
            return response()->json([
                'success' => false,
                'message' => 'Regularisation request not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'admin_remarks' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors'  => $validator->errors()->toArray(),
            ], 422);
        }

        $reg->update([
            'status'        => 'rejected',
            'admin_id'      => $adminProfile ? $adminProfile->id : null,
            'admin_remarks' => $request->input('admin_remarks'),
            'reviewed_at'   => now(),
        ]);

        Log::info('Regularisation rejected by admin', [
            'regularisation_id' => $reg->id,
            'admin_id'          => $adminProfile ? $adminProfile->id : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Regularisation request rejected.',
            'data'    => $this->formatRegularisation($reg->fresh(['profile', 'attendance', 'admin'])),
        ]);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private function formatRegularisation(AttendanceRegularisation $reg): array
    {
        $data = [
            'id'                       => $reg->id,
            'attendance_id'            => $reg->attendance_id,
            'profile_id'               => $reg->profile_id,
            'date'                     => $reg->date?->format('Y-m-d'),
            'requested_check_in_at'    => $reg->requested_check_in_at?->toISOString(),
            'requested_check_out_at'   => $reg->requested_check_out_at?->toISOString(),
            'requested_duration_human' => $reg->requested_duration_human,
            'reason'                   => $reg->reason,
            'status'                   => $reg->status,
            'admin_id'                 => $reg->admin_id,
            'admin_remarks'            => $reg->admin_remarks,
            'reviewed_at'              => $reg->reviewed_at?->toISOString(),
            'created_at'               => $reg->created_at?->toISOString(),
            'updated_at'               => $reg->updated_at?->toISOString(),
        ];

        if ($reg->relationLoaded('profile') && $reg->profile) {
            $data['profile'] = [
                'id'         => $reg->profile->id,
                'first_name' => $reg->profile->first_name,
                'last_name'  => $reg->profile->last_name,
                'full_name'  => $reg->profile->full_name,
                'email'      => $reg->profile->email,
                'role'       => $reg->profile->role,
                'avatar_url' => $reg->profile->avatar_url,
            ];
        }

        if ($reg->relationLoaded('admin') && $reg->admin) {
            $data['admin'] = [
                'id'        => $reg->admin->id,
                'full_name' => $reg->admin->full_name,
                'email'     => $reg->admin->email,
            ];
        }

        return $data;
    }
}
