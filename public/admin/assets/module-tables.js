(() => {
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    const badge = v => {
        const s = String(v ?? '').toUpperCase();
        if (!s) return '';
        const cls = /SUCCESS|ACTIVE|ONLINE|APPROVED|SETTLED|READY|CONNECTED|YES|OK/.test(s) ? 'badge-success'
            : /FAILED|SUSPENDED|REJECTED|EXPIRED|DISCONNECTED|ERROR/.test(s) ? 'badge-danger'
            : /PROCESSING|PENDING|REVIEW|DEGRADED|WARNING|UNKNOWN|PROOF/.test(s) ? 'badge-warning' : 'badge-info';
        return `<span class="badge ${cls}">${esc(s)}</span>`;
    };
    const schemas = {
        users: ['ID','Name','Email','Tenant','Role','Status','Last Login','Actions'],
        agents: ['Agent ID','Agent / Reseller','Tenant','Level','Wallet Balance','Commission Rate','Referral','Transaction Limit','Status','Actions'],
        products: ['SKU','Product Name','Category','Provider','Buy Price','Sell Price','Margin','Stock / Quota','Status','Actions'],
        categories: ['Category ID','Category','Slug','Product Count','Display Order','Client Visible','Created','Status','Actions'],
        prices: ['Price ID','Product','Provider','Price Tier','Buy Price','Sell Price','Margin','Effective From','Status','Actions'],
        transactions: ['Reference','Date / Time','Agent / User','Product','Destination','Amount','Provider','Provider Ref','Status','Actions'],
        wallet: ['Wallet ID','Owner','Tenant','Currency','Balance','Credit Today','Debit Today','Available','Status','Actions'],
        deposits: ['Deposit ID','User / Agent','Tenant','Wallet','Amount','Method','Proof','Requested At','Status','Actions'],
        providers: ['Provider ID','Provider','Code','Products','Balance','Latency','Success Rate','Last Health Check','Status','Actions'],
        mapping: ['Mapping ID','Internal SKU','Product','Provider','Provider SKU','Buy Price','Priority','Mapped At','Status','Actions'],
        health: ['Provider','Status','Latency','Success Rate','Error Rate','Timeouts','Balance Check','Last Check','Action'],
        routing: ['Rule ID','Rule Name','Product Scope','Primary','Fallback','Priority','Condition','Status','Updated','Actions'],
        payment: ['Gateway ID','Gateway','Method','Merchant','Transactions','Success Rate','Fee','Last Webhook','Status','Actions'],
        whatsapp: ['Session ID','Tenant','Phone Number','Messages Today','Quota','Last Message','Webhook','Connected Since','Status','Actions'],
        notifications: ['Template ID','Template','Channel','Event','Audience','Sent','Failed','Last Sent','Status','Actions'],
        commissions: ['Settlement ID','Agent','Tenant','Period','Gross Sales','Commission Rate','Commission','Paid','Outstanding','Status','Actions'],
        promotions: ['Promo ID','Promotion','Code','Type','Discount','Start','End','Usage','Usage Limit','Status','Actions'],
        reports: ['Report ID','Report Type','Period','Scope','Transactions','Revenue','Cost','Profit','Generated At','Status','Actions'],
        tenants: ['Tenant ID','Tenant','Slug','Domain','Users','Agents','Wallet Balance','Status','Created','Actions'],
        branding: ['Tenant','Brand Name','Logo','Favicon','Domain','Updated','Status','Actions'],
        theme: ['Theme ID','Tenant','Theme Name','Mode','Primary Color','Components','Updated','Status','Actions'],
        kyc: ['KYC ID','Customer / Agent','Document','OCR Status','Verification','Risk','Reviewer','Updated','Status','Actions'],
        remittance: ['Reference','Sender','Beneficiary','Currency','Amount','Rate','Fee','Destination','Status','Actions'],
        vpn: ['Product','Plan','Tenant','Subscription','Device','Expiry','Usage','Status','Actions'],
        audit: ['Timestamp','User','Tenant','Module','Action','Reference','IP Address','Result','Actions'],
        settings: ['Setting','Module','Value / Status','Environment','Updated By','Updated At','Actions']
    };
    const actions = {
        users:['View','Edit','Role','Suspend'], agents:['View','Edit','Wallet','Commission','Suspend'], products:['View','Edit','Pricing','Disable'],
        categories:['View','Edit','Products'], prices:['View','Edit','History'], transactions:['View','Retry','Refund','Audit'], wallet:['View','Ledger','Credit','Debit'],
        deposits:['View','Approve','Reject','Proof'], providers:['View','Configure','Test','Logs'], mapping:['Edit','Test','Priority','Disable'], health:['Inspect','Test','Logs'],
        routing:['View','Edit','Priority','Test'], payment:['Configure','Test','Webhook','Logs'], whatsapp:['Connect','Disconnect','Test','Logs'], notifications:['Edit','Test','Logs'],
        commissions:['View','Approve','Settle'], promotions:['View','Edit','Activate','Disable'], reports:['View','Export','Download'], tenants:['View','Edit','Users','Suspend'],
        branding:['View','Edit','Upload'], theme:['View','Edit','Preview'], kyc:['Review','Approve','Reject','Documents'], remittance:['View','Audit'], vpn:['View','Edit','Provision'],
        audit:['View Detail'], settings:['View','Edit']
    };
    const samples = {
        agents:[['AGT-001','Agent Bronze','Tenant Alpha','Bronze','Rp 2.500.000','1,5%','12','Rp 5.000.000','ACTIVE'],['AGT-002','Agent Silver','Tenant Alpha','Silver','Rp 8.750.000','2,0%','28','Rp 15.000.000','ACTIVE']],
        products:[['PULSA-TSEL-50K','Telkomsel 50K','Pulsa','Digiflazz','Rp 49.200','Rp 51.500','Rp 2.300','Unlimited','ACTIVE'],['DATA-TSEL-10GB','Telkomsel Data 10GB','Paket Data','Digiflazz','Rp 68.500','Rp 72.000','Rp 3.500','Unlimited','ACTIVE']],
        categories:[['CAT-001','Pulsa','pulsa','84','1','YES','29 Sep 2026','ACTIVE'],['CAT-002','Paket Data','paket-data','126','2','YES','29 Sep 2026','ACTIVE']],
        prices:[['PRC-001','Telkomsel 50K','Digiflazz','Retail','Rp 49.200','Rp 51.500','Rp 2.300','29 Sep 2026','ACTIVE'],['PRC-002','Telkomsel 50K','Digiflazz','Agent','Rp 49.200','Rp 50.800','Rp 1.600','29 Sep 2026','ACTIVE']],
        transactions:[['TRX-00128','29 Sep 2026 00:03','Agent Jakarta','Telkomsel 50K','081234567890','Rp 51.500','Digiflazz','DG-88291','SUCCESS'],['TRX-00126','29 Sep 2026 23:51','Reseller Gold','XL 50K','087812345678','Rp 52.000','Orderkuota','OK-77102','PROCESSING']],
        wallet:[['WAL-001','Admin Operator','Almara Platform','IDR','Rp 842.650.000','Rp 25.000.000','Rp 18.420.000','Rp 842.650.000','ACTIVE'],['WAL-002','Agent Jakarta','Tenant Alpha','IDR','Rp 8.750.000','Rp 3.000.000','Rp 1.250.000','Rp 8.750.000','ACTIVE']],
        deposits:[['DEP-000812','Agent Jakarta','Tenant Alpha','WAL-002','Rp 1.500.000','Manual','Received','29 Sep 2026 00:01','PROOF_RECEIVED'],['DEP-000810','Master Reseller','Tenant Gamma','WAL-004','Rp 2.000.000','QRIS','Verified','28 Sep 2026 22:10','APPROVED']],
        providers:[['PRV-001','Digiflazz','DIGI','1.248','Rp 125.400.000','210 ms','98,8%','00:03:12','ONLINE'],['PRV-004','Provider D','PROVD','128','Rp 9.250.000','620 ms','92,4%','23:58:01','DEGRADED']],
        mapping:[['MAP-001','PULSA-TSEL-50K','Telkomsel 50K','Digiflazz','TSEL50','Rp 49.200','1','29 Sep 2026','ACTIVE'],['MAP-004','PLN-20K','Token PLN 20K','Provider C','PLN20','Rp 19.600','1','28 Sep 2026','PENDING']],
        health:[['Digiflazz','ONLINE','210 ms','98,8%','1,2%','2','OK','00:03:12'],['Provider D','DEGRADED','620 ms','92,4%','7,6%','18','Warning','23:58:01']],
        routing:[['RT-001','Default Pulsa','Pulsa','Digiflazz','Orderkuota','1','Health > 95%','ACTIVE','29 Sep 2026'],['RT-004','Emergency','All','Orderkuota','Digiflazz','99','Primary unavailable','ACTIVE','27 Sep 2026']],
        payment:[['PAY-001','QRIS Gateway','QRIS','ALMARA-001','842','99,2%','0,7%','00:02:58','ACTIVE'],['PAY-002','VA Gateway','Virtual Account','ALMARA-001','521','98,7%','Rp 4.000','23:59:41','ACTIVE']],
        whatsapp:[['WA-001','Tenant Alpha','6281234567890','482','1.000','00:02:41','OK','28 Sep 2026','CONNECTED'],['WA-003','Tenant Gamma','628111222333','98','500','23:41:22','ERROR','27 Sep 2026','DEGRADED']],
        notifications:[['NTF-001','Transaction Success','WhatsApp','transaction.success','Customer','1.842','18','00:03:15','ACTIVE'],['NTF-003','Deposit Approved','Push','deposit.approved','Agent','214','2','23:40:02','ACTIVE']],
        commissions:[['COM-001','Agent Bronze','Tenant Alpha','Sep 2026','Rp 42.500.000','1,5%','Rp 637.500','Rp 500.000','Rp 137.500','PENDING'],['COM-002','Agent Silver','Tenant Alpha','Sep 2026','Rp 88.000.000','2,0%','Rp 1.760.000','Rp 1.760.000','Rp 0','SETTLED']],
        promotions:[['PRO-001','Pulsa Weekend','WEEKEND','Percent','5%','27 Sep 2026','29 Sep 2026','184','500','ACTIVE'],['PRO-004','Tenant Launch','LAUNCH','Fixed','Rp 25.000','01 Sep 2026','15 Sep 2026','80','100','EXPIRED']],
        reports:[['RPT-001','Transaction Summary','Today','All Tenants','1.842','Rp 92.400.000','Rp 88.700.000','Rp 3.700.000','29 Sep 2026 00:05','READY']],
        tenants:[['TEN-001','Tenant Alpha','tenant-alpha','alpha.almara.test','24','18','Rp 125.000.000','ACTIVE','29 Sep 2026'],['TEN-002','Tenant Beta','tenant-beta','beta.almara.test','11','9','Rp 64.500.000','ACTIVE','28 Sep 2026']],
        branding:[['Tenant Alpha','Alpha PPOB','/branding/alpha-logo.png','/branding/alpha.ico','alpha.almara.test','29 Sep 2026','ACTIVE'],['Tenant Beta','Beta Reload','/branding/beta-logo.png','/branding/beta.ico','beta.almara.test','28 Sep 2026','ACTIVE']],
        theme:[['THM-001','Tenant Alpha','Almara Light','light','#2563eb','12','29 Sep 2026','ACTIVE'],['THM-002','Tenant Beta','Midnight','dark','#7c3aed','12','28 Sep 2026','ACTIVE']],
        kyc:[['KYC-001','Agent Bronze','KTP','VERIFIED','APPROVED','LOW','Admin Operator','29 Sep 2026','APPROVED'],['KYC-002','Agent Silver','KTP','REVIEW','PENDING','MEDIUM','—','28 Sep 2026','UNDER_REVIEW']],
        remittance:[['REM-001','Budi Santoso','John Smith','USD','Rp 15.000.000','16.250','Rp 150.000','USA','SUCCESS'],['REM-002','Siti Aminah','Maria Lee','SGD','Rp 8.000.000','12.450','Rp 100.000','Singapore','PROCESSING']],
        vpn:[['VPN-001','VPN Basic','Tenant Alpha','SUB-001','Android','30 Sep 2026','42 GB','ACTIVE'],['VPN-002','VPN Pro','Tenant Beta','SUB-002','Windows','15 Oct 2026','118 GB','ACTIVE']],
        audit:[['29 Sep 2026 00:08','Admin Operator','Almara Platform','agents','CREATE','AGT-001','127.0.0.1','SUCCESS'],['28 Sep 2026 23:58','Kasir Utama','Tenant Alpha','transactions','UPDATE','TRX-00126','127.0.0.1','SUCCESS']],
        settings:[['api.rate_limit','API','60 req/min','production','Super Admin','29 Sep 2026 00:00'],['queue.default','Queue','redis','production','Super Admin','28 Sep 2026 23:50']]
    };

    const key = () => {
        const title = document.getElementById('pageTitle')?.textContent?.trim();
        const map = {'Agent / Reseller':'agents','Provider Mapping':'mapping','Provider Health':'health','Smart Routing':'routing','Payment Gateway':'payment','Theme Engine':'theme','Audit / Logs':'audit'};
        if (map[title]) return map[title];
        return title?.toLowerCase().replace(/\s*\/\s*/g,'/').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') || 'dashboard';
    };
    const findSchema = k => schemas[k] || null;
    function actionHtml(k){ return (actions[k] || ['View']).map(a => `<button type="button" class="btn table-action" data-action="${esc(a.toLowerCase().replace(/\s+/g,'-'))}">${esc(a)}</button>`).join(' '); }
    function render(){
        const k = key(), headers = findSchema(k); if (!headers || k === 'dashboard') return;
        const content = document.getElementById('content'); if (!content) return;
        let table = content.querySelector('.table');
        if (!table) {
            const card = document.createElement('div'); card.className='card module-table-card';
            card.innerHTML = `<div class="section-title"><h3>${esc(document.getElementById('pageTitle')?.textContent || '')} Data</h3><span>${headers.length} columns</span></div><div class="table-wrap"><table class="table"><thead></thead><tbody></tbody></table></div>`;
            content.appendChild(card); table = card.querySelector('.table');
        }
        table.classList.add('module-table');
        table.querySelector('thead').innerHTML = `<tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>`;
        const rows = samples[k] || [];
        table.querySelector('tbody').innerHTML = rows.length ? rows.map(row => `<tr>${row.map((v,i)=>`<td>${i === row.length-1 ? badge(v) : esc(v)}</td>`).join('')}<td>${actionHtml(k)}</td></tr>`).join('') : `<tr><td colspan="${headers.length}" class="empty">Belum ada data.</td></tr>`;
        table.querySelectorAll('.table-action').forEach(btn => btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            if (k === 'agents' && /add/i.test(action)) return;
            window.dispatchEvent(new CustomEvent('almara:table-action',{detail:{module:k,action}}));
        }));
        if (k === 'agents') ensureAgentAdd();
    }
    function ensureAgentAdd(){
        const head = document.getElementById('content')?.querySelector('.page-head .actions'); if (!head) return;
        if (head.querySelector('[data-add-agent]')) return;
        const b=document.createElement('button'); b.type='button'; b.className='btn btn-primary'; b.dataset.addAgent='1'; b.textContent='Add Agent / Reseller'; head.prepend(b); b.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('almara:open-agent-modal')));
        // agent.js binds by button text; its observer will also see this button.
    }
    let lastKey = null;
    let renderScheduled = false;
    function boot(){
        const content=document.getElementById('content'); if(!content) return;
        // Observe only direct page replacements. Do not observe the whole subtree:
        // table rendering itself changes descendants and would cause render loops.
        new MutationObserver(() => {
            if (renderScheduled) return;
            renderScheduled = true;
            requestAnimationFrame(() => {
                renderScheduled = false;
                const nextKey = key();
                if (nextKey !== lastKey) {
                    lastKey = nextKey;
                    render();
                }
            });
        }).observe(content,{childList:true});
        lastKey = key();
        render();
    }
    document.addEventListener('DOMContentLoaded', boot);
})();
