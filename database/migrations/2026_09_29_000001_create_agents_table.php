<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('agent_code')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('level')->default('Retail');
            $table->decimal('wallet_balance', 20, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->unsignedInteger('referral_count')->default(0);
            $table->decimal('transaction_limit', 20, 2)->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
