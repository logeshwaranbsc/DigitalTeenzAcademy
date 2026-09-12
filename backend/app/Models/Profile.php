<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Profile extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'profiles';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'auth_user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'role',
        'status',
        'avatar_url',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope: filter by role
     */
    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope: filter by status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: search by name or email
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'ilike', "%{$search}%")
              ->orWhere('last_name', 'ilike', "%{$search}%")
              ->orWhere('email', 'ilike', "%{$search}%");
        });
    }

    /**
     * Get full name
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Check if the profile is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
