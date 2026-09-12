<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('auth_user_id')->unique(); // Supabase auth.users.id
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255)->unique();
            $table->string('phone', 50)->nullable();
            $table->string('role', 50)->default('student');
            $table->string('status', 20)->default('active');
            $table->text('avatar_url')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for common queries
            $table->index('auth_user_id');
            $table->index('role');
            $table->index('status');
            $table->index('email');
        });

        // Add check constraints for role and status (PostgreSQL)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE profiles ADD CONSTRAINT chk_profiles_role CHECK (role IN ('admin', 'student', 'employee'))");
            DB::statement("ALTER TABLE profiles ADD CONSTRAINT chk_profiles_status CHECK (status IN ('active', 'inactive'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
