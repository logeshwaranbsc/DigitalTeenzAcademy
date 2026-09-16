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
        Schema::create('attendance_regularisations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attendance_id')->nullable(); // FK → attendances.id
            $table->uuid('profile_id');                 // FK → profiles.id
            $table->date('date');
            $table->timestampTz('requested_check_in_at');
            $table->timestampTz('requested_check_out_at');
            $table->text('reason')->nullable();
            $table->string('status', 20)->default('pending'); // 'pending' | 'approved' | 'rejected'
            $table->uuid('admin_id')->nullable();       // FK → profiles.id
            $table->text('admin_remarks')->nullable();
            $table->timestampTz('reviewed_at')->nullable();
            $table->timestamps();

            $table->foreign('attendance_id')
                  ->references('id')
                  ->on('attendances')
                  ->onDelete('set null');

            $table->foreign('profile_id')
                  ->references('id')
                  ->on('profiles')
                  ->onDelete('cascade');

            $table->foreign('admin_id')
                  ->references('id')
                  ->on('profiles')
                  ->onDelete('set null');

            // Indexes
            $table->index('profile_id');
            $table->index('status');
            $table->index('date');
        });

        // PostgreSQL check constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE attendance_regularisations ADD CONSTRAINT chk_att_reg_status CHECK (status IN ('pending', 'approved', 'rejected'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_regularisations');
    }
};
