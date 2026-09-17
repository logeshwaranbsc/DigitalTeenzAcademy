<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/stats
     * Returns dashboard statistics from the database.
     */
    public function stats(): JsonResponse
    {
        $data = Profile::selectRaw("
            COUNT(*) as total_users,
            COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
            COUNT(CASE WHEN role = 'employee' THEN 1 END) as total_employees,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
            COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users
        ")->first();

        $stats = [
            'total_users'     => (int) ($data->total_users ?? 0),
            'total_students'  => (int) ($data->total_students ?? 0),
            'total_employees' => (int) ($data->total_employees ?? 0),
            'active_users'    => (int) ($data->active_users ?? 0),
            'inactive_users'  => (int) ($data->inactive_users ?? 0),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
