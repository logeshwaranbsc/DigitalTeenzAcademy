<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Role;

class AuthController extends Controller
{
    /**
     * Handle authentication for Admin and Employee accounts.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // 1. Input Validation
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:4',
            'role'     => 'required|string|in:admin,employee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $email    = strtolower(trim($request->email));
        $password = $request->password;
        $targetRole = strtolower(trim($request->role));

        // 2. Fetch User with Role from Supabase Database
        $user = User::with('role')->where('email', $email)->first();

        // 3. User Existence Check
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid credentials. User account not found.'
            ], 401);
        }

        // 4. Password Verification
        if (!Hash::check($password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid email or password.'
            ], 401);
        }

        // 5. Account Status Check
        if ($user->status !== 'active') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Account is inactive or suspended. Please contact administrator.'
            ], 403);
        }

        // 6. Role Alignment Check
        $userRoleSlug = $user->role ? strtolower($user->role->slug) : '';
        if ($userRoleSlug !== $targetRole) {
            return response()->json([
                'status'  => 'error',
                'message' => "Access denied. Your account role is '{$user->role->name}', but '{$targetRole}' was selected."
            ], 403);
        }

        // 7. Token Generation (Sanctum or Bearer Token)
        $token = method_exists($user, 'createToken') 
            ? $user->createToken('auth_token')->plainTextToken 
            : base64_encode($user->id . ':' . now());

        // 8. Success Response
        return response()->json([
            'status'  => 'success',
            'message' => 'Authentication successful.',
            'token'   => $token,
            'user'    => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'role'      => $userRoleSlug,
                'role_name' => $user->role ? $user->role->name : ucfirst($userRoleSlug),
                'avatar'    => $user->avatar_url,
            ]
        ], 200);
    }

    /**
     * Handle logout action.
     */
    public function logout(Request $request)
    {
        if ($request->user() && method_exists($request->user(), 'tokens')) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Logged out successfully.'
        ]);
    }
}
