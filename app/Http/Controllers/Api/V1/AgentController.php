<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenant = $request->attributes->get('tenant');

        $agents = Agent::query()
            ->where('tenant_id', $tenant->id)
            ->latest()
            ->paginate(min((int) $request->integer('per_page', 25), 100));

        return response()->json([
            'success' => true,
            'message' => 'Agents berhasil diambil.',
            'data' => $agents->items(),
            'meta' => [
                'current_page' => $agents->currentPage(),
                'last_page' => $agents->lastPage(),
                'per_page' => $agents->perPage(),
                'total' => $agents->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $tenant = $request->attributes->get('tenant');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:190'],
            'level' => ['required', 'string', 'max:30'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'referral_count' => ['nullable', 'integer', 'min:0'],
            'transaction_limit' => ['nullable', 'numeric', 'min:0'],
            'wallet_balance' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:active,inactive,suspended'],
        ]);

        $data['tenant_id'] = $tenant->id;
        $data['agent_code'] = $this->nextCode();
        $data['commission_rate'] ??= 0;
        $data['referral_count'] ??= 0;
        $data['transaction_limit'] ??= 0;
        $data['wallet_balance'] ??= 0;
        $data['status'] ??= 'active';

        $agent = Agent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Agent berhasil dibuat.',
            'data' => $agent,
            'meta' => [],
        ], 201);
    }

    public function show(Request $request, Agent $agent): JsonResponse
    {
        $this->ensureTenant($request, $agent);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $agent,
            'meta' => [],
        ]);
    }

    public function update(Request $request, Agent $agent): JsonResponse
    {
        $this->ensureTenant($request, $agent);

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'nullable', 'email', 'max:190'],
            'level' => ['sometimes', 'required', 'string', 'max:30'],
            'commission_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'referral_count' => ['sometimes', 'integer', 'min:0'],
            'transaction_limit' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:active,inactive,suspended'],
        ]);

        $agent->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Agent berhasil diperbarui.',
            'data' => $agent->fresh(),
            'meta' => [],
        ]);
    }

    public function destroy(Request $request, Agent $agent): JsonResponse
    {
        $this->ensureTenant($request, $agent);
        $agent->delete();

        return response()->json([
            'success' => true,
            'message' => 'Agent berhasil dihapus.',
            'data' => null,
            'meta' => [],
        ]);
    }

    private function nextCode(): string
    {
        $last = Agent::query()->latest('id')->value('agent_code');
        $number = $last ? ((int) preg_replace('/\D+/', '', $last)) + 1 : 1;

        return 'AGT-' . str_pad((string) $number, 3, '0', STR_PAD_LEFT) . '-' . Str::upper(Str::random(4));
    }

    private function ensureTenant(Request $request, Agent $agent): void
    {
        abort_unless($agent->tenant_id === $request->attributes->get('tenant')->id, 404);
    }
}
