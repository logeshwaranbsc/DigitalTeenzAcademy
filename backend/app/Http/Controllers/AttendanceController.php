<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    /**
     * GET /api/attendance/status
     *
     * Returns the currently active check-in for the authenticated user, if any.
     * The frontend uses this on page load to restore the live timer.
     */
    public function status(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $active = Attendance::forProfile($profile->id)
            ->active()
            ->latest('check_in_at')
            ->first();

        return response()->json([
            'success'    => true,
            'data'       => $active ? $this->formatAttendance($active) : null,
            'checked_in' => (bool) $active,
        ]);
    }

    /**
     * POST /api/attendance/check-in
     *
     * Creates a new attendance record for the authenticated user.
     * Rejects the request if the user already has an active check-in.
     */
    public function checkIn(Request $request): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        // Prevent duplicate active check-ins
        $existing = Attendance::forProfile($profile->id)->active()->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You already have an active check-in. Please check out first.',
                'data'    => $this->formatAttendance($existing),
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

    // ── Helpers ───────────────────────────────────────────────────────────────

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
