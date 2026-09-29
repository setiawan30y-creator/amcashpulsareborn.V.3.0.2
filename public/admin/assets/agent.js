(() => {
    const headers = ['Agent ID', 'Agent', 'Tenant', 'Level', 'Wallet Balance', 'Commission Rate', 'Referral', 'Transaction Limit', 'Status'];
    let currentRows = [];

    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
    const token = () => localStorage.getItem('almara_token') || localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
    const apiUrl = path => `${window.ALMARA?.apiBase || '/api/v1'}${path}`;

    const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
    const percent = value => `${Number(value || 0).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`;
    const statusBadge = value => {
        const status = String(value || '').toUpperCase();
        const cls = status === 'ACTIVE' ? 'badge-success' : status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning';
        return `<span class="badge ${cls}">${esc(status)}</span>`;
    };

    async function api(path, options = {}) {
        const headersInit = { Accept: 'application/json', ...(options.headers || {}) };
        const authToken = token();
        if (authToken) headersInit.Authorization = `Bearer ${authToken}`;
        if (options.body && !headersInit['Content-Type']) headersInit['Content-Type'] = 'application/json';

        const response = await fetch(apiUrl(path), { ...options, headers: headersInit });
        let payload = null;
        try { payload = await response.json(); } catch (_) {}
        if (!response.ok) {
            const message = payload?.message || (response.status === 401 ? 'Sesi API belum login.' : `API error ${response.status}`);
            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }
        return payload;
    }

    function render(rows = currentRows) {
        const table = document.querySelector('#content .table');
        if (!table) return;
        table.querySelector('thead').innerHTML = `<tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>`;
        table.querySelector('tbody').innerHTML = rows.length
            ? rows.map(row => `<tr>
                <td>${esc(row.agent_code)}</td>
                <td><strong>${esc(row.name)}</strong><br><small>${esc(row.email || '—')}</small></td>
                <td>${esc(row.tenant?.name || '—')}</td>
                <td>${esc(row.level)}</td>
                <td>${money(row.wallet_balance)}</td>
                <td>${percent(row.commission_rate)}</td>
                <td>${esc(row.referral_count)}</td>
                <td>${money(row.transaction_limit)}</td>
                <td>${statusBadge(row.status)}</td>
            </tr>`).join('')
            : `<tr><td colspan="${headers.length}" style="text-align:center;padding:32px;color:#64748b">Belum ada Agent / Reseller.</td></tr>`;
    }

    function showTableMessage(message) {
        const table = document.querySelector('#content .table');
        if (!table) return;
        table.querySelector('thead').innerHTML = `<tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>`;
        table.querySelector('tbody').innerHTML = `<tr><td colspan="${headers.length}" style="text-align:center;padding:32px;color:#64748b">${esc(message)}</td></tr>`;
    }

    async function loadAgents() {
        try {
            const payload = await api('/agents?per_page=100');
            currentRows = Array.isArray(payload?.data) ? payload.data : [];
            render();
        } catch (error) {
            currentRows = [];
            render();
            if (error.status === 401 || error.status === 403) {
                showTableMessage(`${error.message} Login API v1 diperlukan untuk memuat Agent / Reseller.`);
            } else {
                showTableMessage(error.message || 'Gagal memuat Agent / Reseller dari API v1.');
            }
        }
    }

    function openModal() {
        if (document.getElementById('agentAddModal')) return;
        const wrap = document.createElement('div');
        wrap.id = 'agentAddModal';
        wrap.innerHTML = `<div class="agent-modal-backdrop" data-close></div>
            <div class="agent-modal" role="dialog" aria-modal="true" aria-labelledby="agentModalTitle">
                <div class="agent-modal-head"><div><h2 id="agentModalTitle">Add Agent / Reseller</h2><p>Data akan disimpan melalui API v1 dan otomatis masuk ke tenant aktif.</p></div><button type="button" class="icon-btn" data-close aria-label="Close">×</button></div>
                <form id="agentAddForm"><div class="agent-form-grid">
                    <label>Agent Name<input name="name" class="input" required maxlength="100" placeholder="Nama agent / reseller"></label>
                    <label>Email<input name="email" type="email" class="input" maxlength="190" placeholder="agent@example.com"></label>
                    <label>Level<select name="level" class="select" required><option>Bronze</option><option>Silver</option><option>Gold</option><option>Master</option><option>Retail</option></select></label>
                    <label>Commission Rate (%)<input name="commission_rate" type="number" step="0.01" min="0" max="100" class="input" value="1.5"></label>
                    <label>Transaction Limit<input name="transaction_limit" type="number" min="0" step="1" class="input" value="5000000"></label>
                    <label>Initial Wallet<input name="wallet_balance" type="number" min="0" step="1" class="input" value="0"></label>
                    <label>Referral Count<input name="referral_count" type="number" min="0" step="1" class="input" value="0"></label>
                    <label>Status<select name="status" class="select"><option value="active">ACTIVE</option><option value="inactive">INACTIVE</option><option value="suspended">SUSPENDED</option></select></label>
                </div><div class="agent-modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">Create Agent</button></div></form>
            </div>`;
        const style = document.createElement('style');
        style.textContent = `#agentAddModal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}.agent-modal-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.65);backdrop-filter:blur(3px)}.agent-modal{position:relative;width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.25)}.agent-modal-head{display:flex;justify-content:space-between;gap:20px;padding:22px 24px;border-bottom:1px solid #e5e7eb}.agent-modal-head h2{margin:0;font-size:20px}.agent-modal-head p{margin:5px 0 0;color:#64748b;font-size:13px}.agent-modal form{padding:22px 24px}.agent-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.agent-form-grid label{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;color:#334155}.agent-modal-foot{display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:18px;border-top:1px solid #e5e7eb}@media(max-width:640px){.agent-form-grid{grid-template-columns:1fr}}`;
        document.head.appendChild(style);
        document.body.appendChild(wrap);
        wrap.addEventListener('click', event => { if (event.target.closest('[data-close]')) wrap.remove(); });
        wrap.querySelector('#agentAddForm').addEventListener('submit', async event => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const submit = event.currentTarget.querySelector('button[type="submit"]');
            submit.disabled = true;
            submit.textContent = 'Saving...';
            try {
                await api('/agents', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: form.get('name'),
                        email: form.get('email') || null,
                        level: form.get('level'),
                        commission_rate: Number(form.get('commission_rate') || 0),
                        transaction_limit: Number(form.get('transaction_limit') || 0),
                        wallet_balance: Number(form.get('wallet_balance') || 0),
                        referral_count: Number(form.get('referral_count') || 0),
                        status: form.get('status')
                    })
                });
                wrap.remove();
                await loadAgents();
            } catch (error) {
                alert(error.message || 'Gagal membuat Agent / Reseller.');
                submit.disabled = false;
                submit.textContent = 'Create Agent';
            }
        });
        wrap.querySelector('input[name="name"]')?.focus();
    }

    let active = false;
    let lastTitle = '';
    function activate() {
        const title = document.getElementById('pageTitle')?.textContent || '';
        if (title === lastTitle) return;
        lastTitle = title;

        if (title !== 'Agent / Reseller') {
            active = false;
            return;
        }

        active = true;
        render();
        const button = [...document.querySelectorAll('#content .btn.btn-primary')].find(b => /add agent/i.test(b.textContent));
        if (button && !button.dataset.agentBound) {
            button.dataset.agentBound = '1';
            button.addEventListener('click', openModal);
        }
        loadAgents();
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Listen only for page/title changes, not every DOM mutation inside tables/modals.
        window.addEventListener('almara:page-changed', activate);
        requestAnimationFrame(activate);
    });
})();
