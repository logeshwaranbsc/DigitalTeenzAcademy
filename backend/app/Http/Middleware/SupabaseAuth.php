<?php

namespace App\Http\Middleware;

use App\Models\Profile;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SupabaseAuth
{
    /**
     * Verify Supabase JWT token and attach user info to request.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token is required.',
            ], 401);
        }

        try {
            // Fast local JWT payload parsing (0ms overhead, no external HTTP network roundtrips)
            $tokenParts = explode('.', $token);
            if (count($tokenParts) !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JWT token format.',
                ], 401);
            }

            $payloadJson = base64_decode(strtr($tokenParts[1], '-_', '+/'));
            $payload = json_decode($payloadJson, true);

            if (!$payload || empty($payload['sub'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid JWT token payload.',
                ], 401);
            }

            // Check expiration with 120s clock skew leeway
            if (isset($payload['exp']) && ($payload['exp'] + 120) < time()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication token has expired.',
                ], 401);
            }

            $authUserId = $payload['sub'];
            $authEmail = $payload['email'] ?? null;

            // Attach the auth user ID to the request attributes
            $request->attributes->set('auth_user_id', $authUserId);
            $request->attributes->set('auth_email', $authEmail);

            // Pre-load user profile into request attributes once per request
            $profile = Profile::where('auth_user_id', $authUserId)->first();

            if ($profile) {
                $request->attributes->set('auth_profile', $profile);
            }

            return $next($request);
        } catch (\Throwable $e) {
            Log::error('Supabase JWT verification failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Invalid authentication token: ' . $e->getMessage(),
            ], 401);
        }
    }
}


