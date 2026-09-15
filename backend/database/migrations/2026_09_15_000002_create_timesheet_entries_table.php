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
        Schema::create('timesheet_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attendance_id');   // FK → attendances.id
            $table->uuid('profile_id');      // FK → profiles.id (for easier querying)
            $table->string('task', 255);
            $table->text('task_description')->nullable();
            $table->integer('duration_minutes'); // must be > 0
            $table->timestamps();

            $table->foreign('attendance_id')
                  ->references('id')
                  ->on('attendances')
                  ->onDelete('cascade');

            $table->foreign('profile_id')
                  ->references('id')
                  ->on('profiles')
                  ->onDelete('cascade');

            // Indexes
            $table->index('attendance_id');
            $table->index('profile_id');
        });

        // PostgreSQL check constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE timesheet_entries ADD CONSTRAINT chk_timesheet_duration_positive CHECK (duration_minutes > 0)");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheet_entries');
    }
};
