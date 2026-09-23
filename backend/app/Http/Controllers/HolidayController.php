<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class HolidayController extends Controller
{
    /**
     * GET /api/holidays
     *
     * List organization holidays. Accessible by all authenticated users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Holiday::with('creator');

        if ($year = $request->input('year')) {
            $query->whereYear('date', (int) $year);
        }

        if ($month = $request->input('month')) {
            $query->whereMonth('date', (int) $month);
        }

        if ($startDate = $request->input('start_date')) {
            $query->whereDate('date', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date')) {
            $query->whereDate('date', '<=', $endDate);
        }

        $holidays = $query->orderBy('date', 'asc')->get()->map(function (Holiday $h) {
            return $this->formatHoliday($h);
        });

        return response()->json([
            'success' => true,
            'data'    => $holidays,
        ]);
    }

    /**
     * POST /api/holidays
     *
     * Create a new holiday record (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $adminProfile = $request->attributes->get('admin_profile');

        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'date'         => 'required|date|unique:holidays,date',
            'description'  => 'nullable|string|max:1000',
            'is_recurring' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors'  => $validator->errors()->toArray(),
            ], 422);
        }

        $holiday = Holiday::create([
            'title'        => $request->input('title'),
            'date'         => $request->input('date'),
            'description'  => $request->input('description'),
            'is_recurring' => $request->boolean('is_recurring', false),
            'created_by'   => $adminProfile?->id,
        ]);

        // Sync existing absent/active attendance records for this date to 'holiday'
        try {
            \App\Models\Attendance::whereDate('check_in_at', $holiday->date)
                ->whereIn('status', ['absent', 'active'])
                ->update(['status' => 'holiday']);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::warning('Holiday attendance sync constraint check error: ' . $e->getMessage());
        }

        Log::info('Holiday created by admin', [
            'holiday_id' => $holiday->id,
            'title'      => $holiday->title,
            'date'       => $holiday->date->format('Y-m-d'),
            'admin_id'   => $adminProfile?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Holiday created successfully.',
            'data'    => $this->formatHoliday($holiday->fresh('creator')),
        ], 201);
    }

    /**
     * PUT /api/holidays/{id}
     *
     * Update an existing holiday record (Admin only).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $adminProfile = $request->attributes->get('admin_profile');

        $holiday = Holiday::find($id);
        if (!$holiday) {
            return response()->json([
                'success' => false,
                'message' => 'Holiday not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|required|string|max:255',
            'date'         => 'sometimes|required|date|unique:holidays,date,' . $id,
            'description'  => 'nullable|string|max:1000',
            'is_recurring' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors'  => $validator->errors()->toArray(),
            ], 422);
        }

        $oldDate = $holiday->date?->format('Y-m-d');

        $holiday->update($request->only([
            'title',
            'date',
            'description',
            'is_recurring',
        ]));

        $newDate = $holiday->fresh()->date?->format('Y-m-d');

        try {
            if ($oldDate && $oldDate !== $newDate) {
                // Revert old date holiday attendances back to absent
                \App\Models\Attendance::whereDate('check_in_at', $oldDate)
                    ->where('status', 'holiday')
                    ->update(['status' => 'absent']);
            }

            // Sync new date absent attendances to holiday
            if ($newDate) {
                \App\Models\Attendance::whereDate('check_in_at', $newDate)
                    ->whereIn('status', ['absent', 'active'])
                    ->update(['status' => 'holiday']);
            }
        } catch (\Illuminate\Database\QueryException $e) {
            Log::warning('Holiday attendance sync constraint check error: ' . $e->getMessage());
        }

        Log::info('Holiday updated by admin', [
            'holiday_id' => $holiday->id,
            'admin_id'   => $adminProfile?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Holiday updated successfully.',
            'data'    => $this->formatHoliday($holiday->fresh('creator')),
        ]);
    }

    /**
     * DELETE /api/holidays/{id}
     *
     * Delete a holiday record (Admin only).
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $adminProfile = $request->attributes->get('admin_profile');

        $holiday = Holiday::find($id);
        if (!$holiday) {
            return response()->json([
                'success' => false,
                'message' => 'Holiday not found.',
            ], 404);
        }

        $holidayDate = $holiday->date?->format('Y-m-d');

        $holiday->delete();

        if ($holidayDate) {
            \App\Models\Attendance::whereDate('check_in_at', $holidayDate)
                ->where('status', 'holiday')
                ->update(['status' => 'absent']);
        }

        Log::info('Holiday deleted by admin', [
            'holiday_id' => $id,
            'admin_id'   => $adminProfile?->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Holiday deleted successfully.',
        ]);
    }

    /**
     * Format Holiday model for JSON response.
     */
    private function formatHoliday(Holiday $holiday): array
    {
        return [
            'id'           => $holiday->id,
            'title'        => $holiday->title,
            'description'  => $holiday->description,
            'date'         => $holiday->date?->format('Y-m-d'),
            'is_recurring' => (bool) $holiday->is_recurring,
            'created_by'   => $holiday->created_by,
            'creator'      => $holiday->creator ? [
                'id'        => $holiday->creator->id,
                'full_name' => $holiday->creator->full_name,
                'email'     => $holiday->creator->email,
            ] : null,
            'created_at'   => $holiday->created_at?->toISOString(),
            'updated_at'   => $holiday->updated_at?->toISOString(),
        ];
    }
}
