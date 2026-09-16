<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasUuids;

    protected $table = 'attendances';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'profile_id',
        'user_type',
        'check_in_at',
        'check_out_at',
        'total_duration_minutes',
        'status',
    ];

    protected $casts = [
        'check_in_at'  => 'datetime',
        'check_out_at' => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function timesheetEntries(): HasMany
    {
        return $this->hasMany(TimesheetEntry::class, 'attendance_id');
    }

    public function regularisations(): HasMany
    {
        return $this->hasMany(AttendanceRegularisation::class, 'attendance_id');
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Get total duration formatted as HH:MM
     */
    public function getTotalDurationHumanAttribute(): string
    {
        if ($this->total_duration_minutes === null) {
            return '—';
        }
        $hours   = intdiv($this->total_duration_minutes, 60);
        $minutes = $this->total_duration_minutes % 60;
        return sprintf('%02d:%02d', $hours, $minutes);
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    /**
     * Scope: filter by status
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: filter by profile
     */
    public function scopeForProfile($query, string $profileId)
    {
        return $query->where('profile_id', $profileId);
    }
}
