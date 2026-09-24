<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    private SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    /**
     * GET /api/users
     * List users with search, filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Profile::query();

        // Search
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Filter by role
        if ($role = $request->input('role')) {
            $query->role($role);
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->status($status);
        }

        // Order by newest first
        $query->orderBy('created_at', 'desc');

        // Paginate
        $perPage = min((int) $request->input('per_page', 15), 100);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
        ]);
    }

    /**
     * GET /api/users/{id}
     * Get a single user.
     */
    public function show(string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * POST /api/users
     * Create a new user (Supabase Auth + profile).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:profiles,email',
            'password' => 'required|string|min:6|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|string|in:student,employee,admin',
            'status' => 'sometimes|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $validated = $validator->validated();

        DB::beginTransaction();
        try {
            // 1. Create Supabase Auth user (server-side via service role key with user metadata)
            $authUser = $this->supabase->createAuthUser(
                $validated['email'],
                $validated['password'],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'role' => $validated['role'],
                    'phone' => $validated['phone'] ?? null,
                ]
            );

            $authUserId = $authUser['id'] ?? null;
            if (!$authUserId) {
                throw new \Exception('Failed to obtain auth user ID from Supabase.');
            }

            // 2. Create or update application profile (handles trigger pre-insert)
            $profile = Profile::updateOrCreate(
                ['auth_user_id' => $authUserId],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'role' => $validated['role'],
                    'status' => $validated['status'] ?? 'active',
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully.',
                'data' => $profile,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            // If Supabase auth user was created but profile failed, try to clean up
            if (isset($authUserId)) {
                try {
                    $this->supabase->deleteAuthUser($authUserId);
                } catch (\Exception $cleanupErr) {
                    // Log but don't throw
                    logger()->warning('Failed to cleanup Supabase auth user: ' . $cleanupErr->getMessage());
                }
            }

            // Check for duplicate email
            if (str_contains($e->getMessage(), 'already been registered') ||
                str_contains($e->getMessage(), 'already exists') ||
                str_contains($e->getMessage(), 'duplicate')) {
                return response()->json([
                    'success' => false,
                    'message' => 'A user with this email address already exists.',
                ], 422);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT /api/users/{id}
     * Update an existing user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:profiles,email,' . $id,
            'phone' => 'nullable|string|max:50',
            'role' => 'sometimes|required|string|in:student,employee,admin',
            'status' => 'sometimes|required|string|in:active,inactive',
            'password' => 'nullable|string|min:6|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $validated = $validator->validated();

        DB::beginTransaction();
        try {
            // Update Supabase Auth email if changed
            if (isset($validated['email']) && $validated['email'] !== $profile->email) {
                $this->supabase->updateAuthUserEmail($profile->auth_user_id, $validated['email']);
            }

            // Update Supabase Auth password if provided
            if (!empty($validated['password'])) {
                $this->supabase->updateAuthUserPassword($profile->auth_user_id, $validated['password']);
                unset($validated['password']); // Don't store in profile
            }

            // Update profile fields
            $profile->update(array_filter($validated, function ($key) {
                return $key !== 'password';
            }, ARRAY_FILTER_USE_KEY));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => $profile->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/users/{id}
     * Soft-delete a user.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        // Prevent admin from deleting themselves
        $adminProfile = $request->attributes->get('admin_profile');
        if ($adminProfile && $adminProfile->id === $profile->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        try {
            // Soft-delete the profile (preserves data)
            $profile->update(['status' => 'inactive']);
            $profile->delete(); // sets deleted_at

            return response()->json([
                'success' => true,
                'message' => 'User has been deleted.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user.',
            ], 500);
        }
    }

    /**
     * PATCH /api/users/{id}/status
     * Activate or deactivate a user.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $profile = Profile::find($id);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status value.',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $profile->update(['status' => $request->input('status')]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully.',
            'data' => $profile->fresh(),
        ]);
    }
}
