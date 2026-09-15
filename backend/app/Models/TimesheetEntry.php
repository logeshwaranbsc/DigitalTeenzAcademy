<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimesheetEntry extends Model
{
    use HasUuids;

    protected $table = 'timesheet_entries';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'attendance_id',
        'profile_id',
        'task',
        'task_description',
        'duration_minutes',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'created_at'       => 'datetime',
        'updated_at'       => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class, 'attendance_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Get duration formatted as "X h Y min"
     */
    public function getDurationHumanAttribute(): string
    {
        $hours   = intdiv($this->duration_minutes, 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}min";
        }
        if ($hours > 0) {
            return "{$hours}h";
        }
        return "{$minutes}min";
    }
}
