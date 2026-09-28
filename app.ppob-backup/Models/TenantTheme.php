<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantTheme extends Model
{
    protected $fillable = ['tenant_id','tokens'];
    protected function casts(): array { return ['tokens' => 'array']; }
}
