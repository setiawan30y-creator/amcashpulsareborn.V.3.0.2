<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'status',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function settings()
    {
        return $this->hasMany(TenantSetting::class);
    }

    public function branding()
    {
        return $this->hasOne(TenantBranding::class);
    }

    public function theme()
    {
        return $this->hasOne(TenantTheme::class);
    }
}
