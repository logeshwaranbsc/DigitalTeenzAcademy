<?php

use App\Http\Controllers\AdminRegularisationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RequireAdmin;
use App\Http\Middleware\SupabaseAuth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes require Supabase JWT authentication via the SupabaseAuth middleware.
| Admin-only routes additionally require the RequireAdmin middleware.
|
*/

// Authenticated routes (any valid Supabase user)
Route::middleware([SupabaseAuth::class])->group(function () {
    // Get authenticated user's profile
    Route::post('/auth/profile', [AuthController::class, 'profile']);

    // ── Attendance / Check-In / Check-Out ────────────────────────────────────
    Route::prefix('attendance')->group(function () {
        // Get current check-in status (restores timer on page reload)
        Route::get('/status', [AttendanceController::class, 'status']);
        // Check in
        Route::post('/check-in', [AttendanceController::class, 'checkIn']);
        // Check out
        Route::post('/check-out', [AttendanceController::class, 'checkOut']);
        // Timesheet entries for a session
        Route::get('/{id}/timesheet', [TimesheetController::class, 'index']);
        Route::post('/{id}/timesheet', [TimesheetController::class, 'store']);
        // User Attendance History
        Route::get('/my-history', [AttendanceController::class, 'myHistory']);
        // User Regularisation Requests
        Route::get('/regularisations', [AttendanceController::class, 'getUserRegularisations']);
        Route::post('/regularisations', [AttendanceController::class, 'storeRegularisation']);
    });
});

// Admin-only routes
Route::middleware([SupabaseAuth::class, RequireAdmin::class])->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Admin Attendance Listing
    Route::get('/attendance', [AttendanceController::class, 'adminIndex']);

    // Admin Regularisation Requests
    Route::get('/admin/regularisations', [AdminRegularisationController::class, 'index']);
    Route::post('/admin/regularisations/{id}/approve', [AdminRegularisationController::class, 'approve']);
    Route::post('/admin/regularisations/{id}/reject', [AdminRegularisationController::class, 'reject']);

    // User Management CRUD
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
});
