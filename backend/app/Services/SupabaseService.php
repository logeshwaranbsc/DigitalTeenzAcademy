<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    private string $url;
    private string $serviceRoleKey;

    public function __construct()
    {
        $this->url = config('services.supabase.url');
        $this->serviceRoleKey = config('services.supabase.service_role_key');
    }

    /**
     * Create a Supabase Auth user (uses service role key if available, falls back to signup API)
     */
    public function createAuthUser(string $email, string $password): array
    {
        // 1. Try admin endpoint if service role key is available
        if (!empty($this->serviceRoleKey)) {
            $response = Http::withoutVerifying()->withHeaders([
                'apikey' => $this->serviceRoleKey,
                'Authorization' => 'Bearer ' . $this->serviceRoleKey,
                'Content-Type' => 'application/json',
            ])->post(rtrim($this->url, '/') . '/auth/v1/admin/users', [
                'email' => $email,
                'password' => $password,
                'email_confirm' => true,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            $error = $response->json('msg') ?? $response->json('message') ?? $response->json('error_description');
            if ($error && !str_contains(strtolower($error), 'invalid api key') && !str_contains(strtolower($error), 'unauthorized')) {
                throw new \Exception($error);
            }
        }

        // 2. Fallback to signup endpoint using anon key
        $anonKey = config('services.supabase.anon_key');
        $response = Http::withoutVerifying()->withHeaders([
            'apikey' => $anonKey,
            'Content-Type' => 'application/json',
        ])->post(rtrim($this->url, '/') . '/auth/v1/signup', [
            'email' => $email,
            'password' => $password,
        ]);

        if (!$response->successful()) {
            $error = $response->json('msg') ?? $response->json('message') ?? $response->json('error_description') ?? 'Failed to create auth user';
            throw new \Exception($error);
        }

        return $response->json();
    }

    /**
     * Delete a Supabase Auth user
     */
    public function deleteAuthUser(string $authUserId): void
    {
        if (empty($this->serviceRoleKey)) {
            logger()->warning("Cannot delete Supabase Auth user {$authUserId}: SUPABASE_SERVICE_ROLE_KEY is not set.");
            return;
        }

        $response = Http::withoutVerifying()->withHeaders([
            'apikey' => $this->serviceRoleKey,
            'Authorization' => 'Bearer ' . $this->serviceRoleKey,
        ])->delete(rtrim($this->url, '/') . '/auth/v1/admin/users/' . $authUserId);

        if (!$response->successful()) {
            $error = $response->json('msg') ?? $response->json('message') ?? 'Failed to delete auth user';
            throw new \Exception($error);
        }
    }

    /**
     * Update a Supabase Auth user's email
     */
    public function updateAuthUserEmail(string $authUserId, string $newEmail): void
    {
        if (empty($this->serviceRoleKey)) {
            logger()->warning("Cannot update Supabase Auth user email {$authUserId}: SUPABASE_SERVICE_ROLE_KEY is not set.");
            return;
        }

        $response = Http::withoutVerifying()->withHeaders([
            'apikey' => $this->serviceRoleKey,
            'Authorization' => 'Bearer ' . $this->serviceRoleKey,
            'Content-Type' => 'application/json',
        ])->put(rtrim($this->url, '/') . '/auth/v1/admin/users/' . $authUserId, [
            'email' => $newEmail,
            'email_confirm' => true,
        ]);

        if (!$response->successful()) {
            $error = $response->json('msg') ?? $response->json('message') ?? 'Failed to update auth user email';
            throw new \Exception($error);
        }
    }

    /**
     * Update a Supabase Auth user's password
     */
    public function updateAuthUserPassword(string $authUserId, string $newPassword): void
    {
        if (empty($this->serviceRoleKey)) {
            logger()->warning("Cannot update Supabase Auth user password {$authUserId}: SUPABASE_SERVICE_ROLE_KEY is not set.");
            return;
        }

        $response = Http::withoutVerifying()->withHeaders([
            'apikey' => $this->serviceRoleKey,
            'Authorization' => 'Bearer ' . $this->serviceRoleKey,
            'Content-Type' => 'application/json',
        ])->put(rtrim($this->url, '/') . '/auth/v1/admin/users/' . $authUserId, [
            'password' => $newPassword,
        ]);

        if (!$response->successful()) {
            $error = $response->json('msg') ?? $response->json('message') ?? 'Failed to update password';
            throw new \Exception($error);
        }
    }
}
