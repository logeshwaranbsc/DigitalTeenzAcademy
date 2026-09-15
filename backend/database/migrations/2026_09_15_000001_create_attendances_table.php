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
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('profile_id');          // FK → profiles.id
            $table->string('user_type', 20);     // 'student' | 'employee'
            $table->timestampTz('check_in_at');
            $table->timestampTz('check_out_at')->nullable();
            $table->integer('total_duration_minutes')->nullable(); // set on checkout
            $table->string('status', 20)->default('active');      // 'active' | 'completed'
            $table->timestamps();

            $table->foreign('profile_id')
                  ->references('id')
                  ->on('profiles')
                  ->onDelete('cascade');

            // Indexes
            $table->index('profile_id');
            $table->index('status');
            $table->index(['profile_id', 'status']);
        });

        // PostgreSQL check constraints
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_user_type CHECK (user_type IN ('student', 'employee'))");
            DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_status CHECK (status IN ('active', 'completed'))");
            DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_duration_positive CHECK (total_duration_minutes IS NULL OR total_duration_minutes >= 0)");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
