<?php

namespace App\Console\Commands;

use App\Models\Profile;
use App\Services\SupabaseService;
use Illuminate\Console\Command;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create';
    protected $description = 'Create the initial admin user securely';

    public function handle(): int
    {
        $this->info('');
        $this->info('╔══════════════════════════════════════════════╗');
        $this->info('║    Digital Teenz Academy - Admin Setup       ║');
        $this->info('╚══════════════════════════════════════════════╝');
        $this->info('');

        $firstName = $this->ask('Enter admin first name');
        $lastName = $this->ask('Enter admin last name');
        $email = $this->ask('Enter admin email address');
        $password = $this->secret('Enter admin password (min 6 characters)');

        // Validate
        if (!$firstName || !$lastName || !$email || !$password) {
            $this->error('All fields are required.');
            return Command::FAILURE;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address.');
            return Command::FAILURE;
        }

        if (strlen($password) < 6) {
            $this->error('Password must be at least 6 characters.');
            return Command::FAILURE;
        }

        // Check for existing admin with same email
        if (Profile::where('email', $email)->exists()) {
            $this->error("A user with email '{$email}' already exists.");
            return Command::FAILURE;
        }

        $this->info('');
        $this->info("Creating admin: {$firstName} {$lastName} ({$email})");
        $this->info('');

        try {
            $supabase = app(SupabaseService::class);

            // 1. Create Supabase Auth user
            $this->info('→ Creating Supabase Auth account...');
            $authUser = $supabase->createAuthUser($email, $password);
            $authUserId = $authUser['id'];
            $this->info("  ✓ Auth account created (ID: {$authUserId})");

            // 2. Create profile with admin role
            $this->info('→ Creating admin profile...');
            $profile = Profile::create([
                'auth_user_id' => $authUserId,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'role' => 'admin',
                'status' => 'active',
            ]);
            $this->info("  ✓ Admin profile created (ID: {$profile->id})");

            $this->info('');
            $this->info('╔══════════════════════════════════════════════╗');
            $this->info('║  ✅ Admin user created successfully!         ║');
            $this->info('╚══════════════════════════════════════════════╝');
            $this->info('');
            $this->info("You can now log in at /admin/login with:");
            $this->info("  Email: {$email}");
            $this->info('');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('');
            $this->error("Failed to create admin: {$e->getMessage()}");
            $this->error('');
            $this->error('Possible causes:');
            $this->error('  - Supabase URL or Service Role Key not configured');
            $this->error('  - Email already registered in Supabase Auth');
            $this->error('  - Network connectivity issue');
            return Command::FAILURE;
        }
    }
}
