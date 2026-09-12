<?php

namespace App\Http\Middleware;

use App\Models\Profile;
use Closure;
use Illuminate\Http\Request;

class RequireAdmin
{
    /**
     * Verify the authenticated user has admin role.
     */
    public function handle(Request $request, Closure $next)
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

        if ($profile->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Admin access required. You do not have permission to perform this action.',
            ], 403);
        }

        if ($profile->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated.',
            ], 403);
        }

        // Attach the profile to the request for use in controllers
        $request->attributes->set('admin_profile', $profile);

        return $next($request);
    }
}
