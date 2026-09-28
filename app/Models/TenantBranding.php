<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantBranding extends Model
{
    protected $fillable = ['tenant_id','brand_name','logo_path','favicon_path','domain'];
    
}
