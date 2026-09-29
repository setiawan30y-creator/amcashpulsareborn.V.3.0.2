<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agent extends Model
{
    protected $fillable = [
        'tenant_id',
        'agent_code',
        'name',
        'email',
        'level',
        'wallet_balance',
        'commission_rate',
        'referral_count',
        'transaction_limit',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'wallet_balance' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'transaction_limit' => 'decimal:2',
            'referral_count' => 'integer',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
