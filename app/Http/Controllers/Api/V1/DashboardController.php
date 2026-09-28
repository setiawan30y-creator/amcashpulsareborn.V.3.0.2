<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenant = $request->attributes->get('tenant');

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => [
                'tenant' => $tenant,
                'metrics' => [
                    'wallet_balance' => 0,
                    'today_transactions' => 0,
                    'today_profit' => 0,
                    'provider_online' => 0,
                ],
                'modules' => [
                    'wallet' => true,
                    'deposits' => true,
                    'products' => true,
                    'transactions' => true,
                    'providers' => true,
                ],
            ],
            'meta' => [],
        ]);
    }
}
