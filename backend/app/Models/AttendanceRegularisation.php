<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRegularisation extends Model
{
    use HasUuids;

    protected $table = 'attendance_regularisations';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'attendance_id',
        'profile_id',
        'date',
        'requested_check_in_at',
        'requested_check_out_at',
        'reason',
        'status',
        'admin_id',
        'admin_remarks',
        'reviewed_at',
    ];

    protected $casts = [
        'date'                   => 'date:Y-m-d',
        'requested_check_in_at'  => 'datetime',
        'requested_check_out_at' => 'datetime',
        'reviewed_at'            => 'datetime',
        'created_at'             => 'datetime',
        'updated_at'             => 'datetime',
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

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'admin_id');
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Requested duration in minutes
     */
    public function getRequestedDurationMinutesAttribute(): int
    {
        if (!$this->requested_check_in_at || !$this->requested_check_out_at) {
            return 0;
        }
        return (int) $this->requested_check_in_at->diffInMinutes($this->requested_check_out_at);
    }

    /**
     * Requested duration human formatted
     */
    public function getRequestedDurationHumanAttribute(): string
    {
        $minutes = $this->requested_duration_minutes;
        $hours = intdiv($minutes, 60);
        $mins = $minutes % 60;
        return sprintf('%02d:%02d', $hours, $mins);
    }
}
