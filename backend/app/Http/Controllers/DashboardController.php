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
        $stats = [
            'total_users' => Profile::count(),
            'total_students' => Profile::where('role', 'student')->count(),
            'total_employees' => Profile::where('role', 'employee')->count(),
            'active_users' => Profile::where('status', 'active')->count(),
            'inactive_users' => Profile::where('status', 'inactive')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
