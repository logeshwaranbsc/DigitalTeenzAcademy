<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
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
});

// Admin-only routes
Route::middleware([SupabaseAuth::class, RequireAdmin::class])->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // User Management CRUD
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
});
