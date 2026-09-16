<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_status");
            DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_status CHECK (status IN ('active', 'completed', 'absent', 'present'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE attendances DROP CONSTRAINT IF EXISTS chk_attendances_status");
            DB::statement("ALTER TABLE attendances ADD CONSTRAINT chk_attendances_status CHECK (status IN ('active', 'completed'))");
        }
    }
};
