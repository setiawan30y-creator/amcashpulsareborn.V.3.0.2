<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (! $tenant || ! $tenant->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant tidak tersedia atau tidak aktif.',
                'code' => 'TENANT_UNAVAILABLE',
            ], 403);
        }

        $request->attributes->set('tenant', $tenant);

        return $next($request);
    }
}
