<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * POST /api/auth/profile
     * Returns the authenticated user's application profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $authUserId = $request->attributes->get('auth_user_id');

        if (!$authUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.',
            ], 401);
        }

        \Illuminate\Support\Facades\Log::info('Profile request received', [
            'auth_user_id' => $authUserId,
            'auth_email' => $request->attributes->get('auth_email'),
        ]);

        $authEmail = $request->attributes->get('auth_email');

        $profile = Profile::where('auth_user_id', $authUserId)->first();

        // 1. Try matching by email if auth_user_id isn't linked yet
        if (!$profile && $authEmail) {
            $profile = Profile::where('email', $authEmail)->first();
            if ($profile) {
                $profile->auth_user_id = $authUserId;
                $profile->save();
            }
        }

        // 2. If no profiles exist in the database (initial setup), bootstrap this first authenticated user as Admin
        if (!$profile && Profile::count() === 0 && $authEmail) {
            $emailPrefix = explode('@', $authEmail)[0];
            $parts = explode('.', str_replace(['_', '-'], '.', $emailPrefix));
            $firstName = ucfirst($parts[0] ?? 'Admin');
            $lastName = isset($parts[1]) ? ucfirst($parts[1]) : 'User';

            $profile = Profile::create([
                'auth_user_id' => $authUserId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $authEmail,
                'role' => 'admin',
                'status' => 'active',
            ]);

            \Illuminate\Support\Facades\Log::info('Bootstrapped initial admin profile', [
                'profile_id' => $profile->id,
                'email' => $authEmail,
                'auth_user_id' => $authUserId,
            ]);
        }

        if (!$profile) {
            \Illuminate\Support\Facades\Log::warning('Profile not found for auth_user_id', [
                'auth_user_id' => $authUserId,
                'auth_email' => $authEmail,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'User profile not found in database. Please create a user profile or run initial setup.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }
}
