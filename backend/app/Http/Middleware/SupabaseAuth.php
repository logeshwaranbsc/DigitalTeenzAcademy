<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

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
            $jwtSecret = config('services.supabase.jwt_secret');

            if ($jwtSecret) {
                // Verify using JWT secret (preferred)
                $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));
            } else {
                // Fallback: verify using JWKS endpoint
                $supabaseUrl = config('services.supabase.url');
                $jwksUrl = rtrim($supabaseUrl, '/') . '/auth/v1/.well-known/jwks.json';

                $jwks = Cache::remember('supabase_jwks', 3600, function () use ($jwksUrl) {
                    $response = Http::withoutVerifying()->get($jwksUrl);
                    return $response->json();
                });

                $keys = JWK::parseKeySet($jwks);
                $decoded = JWT::decode($token, $keys);
            }

            // Check token expiration
            if (isset($decoded->exp) && $decoded->exp < time()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication token has expired.',
                ], 401);
            }

            // Attach the auth user ID to the request
            $request->attributes->set('auth_user_id', $decoded->sub);
            $request->attributes->set('auth_email', $decoded->email ?? null);

            return $next($request);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Supabase JWT verification failed: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid authentication token: ' . $e->getMessage(),
            ], 401);
        }
    }
}
