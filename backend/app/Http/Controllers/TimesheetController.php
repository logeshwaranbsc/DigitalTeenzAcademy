<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Profile;
use App\Models\TimesheetEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimesheetController extends Controller
{
    /**
     * GET /api/attendance/{id}/timesheet
     *
     * Returns all timesheet entries for a completed attendance session.
     * Only the owner may view their own timesheet.
     */
    public function index(Request $request, string $id): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance record not found.'], 404);
        }

        if ($attendance->profile_id !== $profile->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $entries = $attendance->timesheetEntries()->orderBy('created_at')->get();

        return response()->json([
            'success' => true,
            'data'    => $entries->map(fn ($e) => $this->formatEntry($e)),
        ]);
    }

    /**
     * POST /api/attendance/{id}/timesheet
     *
     * Saves multiple timesheet entries for a completed attendance session.
     * Replaces any existing entries for the session (idempotent re-submission).
     *
     * Body: { entries: [{ task, task_description?, duration_minutes }] }
     */
    public function store(Request $request, string $id): JsonResponse
    {
        $profile = $this->getProfile($request);
        if ($profile instanceof JsonResponse) {
            return $profile;
        }

        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['success' => false, 'message' => 'Attendance record not found.'], 404);
        }

        if ($attendance->profile_id !== $profile->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        if ($attendance->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'You must check out before submitting a timesheet.',
            ], 422);
        }

        // Validate input
        $validated = $request->validate([
            'entries'                        => 'required|array|min:1',
            'entries.*.task'                 => 'required|string|max:255',
            'entries.*.task_description'     => 'nullable|string|max:2000',
            'entries.*.duration_minutes'     => 'required|integer|min:1',
        ]);

        // Delete existing entries for idempotent re-submission
        TimesheetEntry::where('attendance_id', $id)->delete();

        $created = [];
        foreach ($validated['entries'] as $entry) {
            $record = TimesheetEntry::create([
                'attendance_id'    => $attendance->id,
                'profile_id'       => $profile->id,
                'task'             => $entry['task'],
                'task_description' => $entry['task_description'] ?? null,
                'duration_minutes' => $entry['duration_minutes'],
            ]);
            $created[] = $this->formatEntry($record);
        }

        $totalMinutes = collect($validated['entries'])->sum('duration_minutes');

        return response()->json([
            'success'               => true,
            'message'               => 'Timesheet submitted successfully.',
            'data'                  => $created,
            'total_duration_minutes'=> $totalMinutes,
        ], 201);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function getProfile(Request $request): Profile|JsonResponse
    {
        $profile = $request->attributes->get('auth_profile');

        if (!$profile) {
            $authUserId = $request->attributes->get('auth_user_id');

            if (!$authUserId) {
                return response()->json(['success' => false, 'message' => 'Authentication required.'], 401);
            }

            $profile = Profile::where('auth_user_id', $authUserId)->first();
        }

        if (!$profile) {
            return response()->json(['success' => false, 'message' => 'User profile not found.'], 404);
        }

        return $profile;
    }

    private function formatEntry(TimesheetEntry $entry): array
    {
        return [
            'id'               => $entry->id,
            'attendance_id'    => $entry->attendance_id,
            'profile_id'       => $entry->profile_id,
            'task'             => $entry->task,
            'task_description' => $entry->task_description,
            'duration_minutes' => $entry->duration_minutes,
            'duration_human'   => $entry->duration_human,
            'created_at'       => $entry->created_at?->toISOString(),
            'updated_at'       => $entry->updated_at?->toISOString(),
        ];
    }
}
