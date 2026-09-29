(() => {
    const KEY = 'almara_admin_agents_v1';
    const defaults = [
        ['AGT-001','Agent Bronze','Tenant Alpha','Bronze','Rp 2.500.000','1,5%','12','Rp 5.000.000','ACTIVE'],
        ['AGT-002','Agent Silver','Tenant Alpha','Silver','Rp 8.750.000','2,0%','28','Rp 15.000.000','ACTIVE'],
        ['AGT-003','Agent Gold','Tenant Beta','Gold','Rp 25.400.000','2,5%','64','Rp 50.000.000','ACTIVE'],
        ['AGT-004','Master Reseller','Tenant Gamma','Master','Rp 72.100.000','3,0%','143','Rp 100.000.000','ACTIVE']
    ];
    const headers = ['Agent ID','Agent','Tenant','Level','Wallet Balance','Commission Rate','Referral','Transaction Limit','Status'];
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    const getRows = () => { try { const x=JSON.parse(localStorage.getItem(KEY)); return Array.isArray(x)&&x.length?x:[...defaults]; } catch(e){ return [...defaults]; } };
    const saveRows = rows => localStorage.setItem(KEY, JSON.stringify(rows));
    const render = () => {
        const table=document.querySelector('#content .table'); if(!table) return;
        const rows=getRows();
        table.querySelector('thead').innerHTML=`<tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>`;
        table.querySelector('tbody').innerHTML=rows.map(r=>`<tr>${r.map((v,i)=>`<td>${i===8?`<span class="badge badge-success">${esc(v)}</span>`:esc(v)}</td>`).join('')}</tr>`).join('');
    };
    const nextId = rows => `AGT-${String(Math.max(0,...rows.map(r=>parseInt(String(r[0]).replace(/\D/g,''),10)||0))+1).padStart(3,'0')}`;
    const openModal = () => {
        if(document.getElementById('agentAddModal')) return;
        const wrap=document.createElement('div'); wrap.id='agentAddModal';
        wrap.innerHTML=`<div class="agent-modal-backdrop" data-close></div><div class="agent-modal" role="dialog" aria-modal="true"><div class="agent-modal-head"><div><h2>Add Agent / Reseller</h2><p>Tambah agent atau reseller baru.</p></div><button type="button" class="icon-btn" data-close>×</button></div><form id="agentAddForm"><div class="agent-form-grid"><label>Agent Name<input name="name" class="input" required placeholder="Nama agent / reseller"></label><label>Email<input name="email" type="email" class="input" required placeholder="agent@example.com"></label><label>Tenant<select name="tenant" class="select"><option>Tenant Alpha</option><option>Tenant Beta</option><option>Tenant Gamma</option><option>Tenant Delta</option></select></label><label>Level<select name="level" class="select"><option>Bronze</option><option>Silver</option><option>Gold</option><option>Master</option><option>Retail</option></select></label><label>Commission Rate<select name="commission" class="select"><option>1,0%</option><option>1,5%</option><option>2,0%</option><option>2,5%</option><option>3,0%</option></select></label><label>Transaction Limit<input name="limit" class="input" value="Rp 5.000.000" required></label><label>Initial Wallet<input name="wallet" class="input" value="Rp 0"></label><label>Referral<input name="referral" type="number" min="0" class="input" value="0"></label></div><div class="agent-modal-foot"><button type="button" class="btn" data-close>Cancel</button><button type="submit" class="btn btn-primary">Create Agent</button></div></form></div>`;
        const style=document.createElement('style'); style.textContent=`#agentAddModal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}.agent-modal-backdrop{position:absolute;inset:0;background:rgba(2,6,23,.65);backdrop-filter:blur(3px)}.agent-modal{position:relative;width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 24px 80px rgba(15,23,42,.25)}.agent-modal-head{display:flex;justify-content:space-between;padding:22px 24px;border-bottom:1px solid #e5e7eb}.agent-modal-head h2{margin:0;font-size:20px}.agent-modal-head p{margin:5px 0 0;color:#64748b;font-size:13px}.agent-modal form{padding:22px 24px}.agent-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.agent-form-grid label{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;color:#334155}.agent-modal-foot{display:flex;justify-content:flex-end;gap:10px;margin-top:24px;padding-top:18px;border-top:1px solid #e5e7eb}@media(max-width:640px){.agent-form-grid{grid-template-columns:1fr}}`; document.head.appendChild(style); document.body.appendChild(wrap);
        wrap.addEventListener('click',e=>{if(e.target.closest('[data-close]')) wrap.remove();});
        wrap.querySelector('#agentAddForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),rows=getRows();rows.push([nextId(rows),f.get('name'),f.get('tenant'),f.get('level'),f.get('wallet')||'Rp 0',f.get('commission'),f.get('referral')||'0',f.get('limit'),'ACTIVE']);saveRows(rows);wrap.remove();render();});
        wrap.querySelector('input[name="name"]')?.focus();
    };
    const activate=()=>{if(document.getElementById('pageTitle')?.textContent!=='Agent / Reseller') return;render();const btn=[...document.querySelectorAll('#content .btn.btn-primary')].find(b=>/add agent/i.test(b.textContent));if(btn&&!btn.dataset.agentBound){btn.dataset.agentBound='1';btn.addEventListener('click',openModal);}};
    document.addEventListener('DOMContentLoaded',()=>{const c=document.getElementById('content');if(c)new MutationObserver(()=>requestAnimationFrame(activate)).observe(c,{childList:true,subtree:true});setTimeout(activate,100);});
})();
