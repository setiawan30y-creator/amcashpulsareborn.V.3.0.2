# MASTER BLUEPRINT — PPOB SAAS PLATFORM
## PT ALMARA PUTRA VALASINDO / PPOB PLATFORM

**Dokumen:** Master Blueprint PPOB SaaS  
**Status:** FINAL — Architecture / Direction  
**Versi:** 1.0  
**Tanggal:** 27 September 2026

---

## 1. TUJUAN PLATFORM

Platform ini dirancang sebagai sistem **PPOB modern, scalable, multi-provider, multi-tenant, white-label, dan SaaS-ready**.

Prinsip utama:

> **Build once, extend many times.**

Artinya core platform dibuat sekali dengan arsitektur yang rapi sehingga:

- supplier dapat ditambah tanpa mengubah core transaction engine;
- produk digital dapat ditambah tanpa membuat ulang sistem;
- tenant/reseller dapat ditambah tanpa membuat aplikasi baru;
- branding dan tema dapat diubah tanpa mengedit halaman satu per satu;
- provider pembayaran dan WhatsApp dapat diganti;
- fitur baru dapat ditambahkan melalui module/service/adapter;
- platform dapat berkembang menjadi SaaS.

---

# 2. ARSITEKTUR UTAMA YANG DIKUNCI

## Backend

- Laravel
- MySQL
- REST API
- Service Layer
- Queue / Background Jobs
- Cache
- Webhook
- Audit Log
- Role & Permission
- Idempotency

Laravel menjadi:

> **Source of Truth / pusat logika bisnis platform.**

Client maupun Admin **tidak boleh mengakses database secara langsung**.

---

# 3. ARSITEKTUR GLOBAL

```text
                         INTERNET
                            │
                     HTTPS / DOMAIN
                            │
              ┌─────────────┴─────────────┐
              │                           │
       CLIENT PWA                   ADMIN PWA
              │                           │
              └─────────────┬─────────────┘
                            │
                         API
                            │
                    ┌───────▼────────┐
                    │    LARAVEL     │
                    │   CORE API     │
                    └───────┬────────┘
                            │
       ┌────────────────────┼─────────────────────┐
       │                    │                     │
   AUTH & USER          WALLET ENGINE        PPOB ENGINE
       │                    │                     │
       │                    │                     │
       └────────────────────┼─────────────────────┘
                            │
                    PROVIDER MANAGER
                            │
             ┌──────────────┼──────────────┐
             │              │              │
        DIGIFLAZZ       ORDERKUOTA     PROVIDER N
             │              │              │
             └──────────────┼──────────────┘
                            │
                    INTERNAL STANDARD
                            │
                    TRANSACTION ENGINE

External Services:
- Payment Gateway
- WhatsApp Gateway
- Push Notification
- Email
- KYC Provider
- Bank Transfer
- FX / Remittance Provider
- VPN Infrastructure
```

---

# 4. SOURCE OF TRUTH

Database dan business logic Laravel adalah sumber kebenaran utama.

```text
PWA
 │
 ▼
Laravel API
 │
 ▼
Business Logic
 │
 ▼
MySQL
```

PWA tidak menentukan status transaksi secara final.

Supplier juga tidak menentukan struktur internal database.

Supplier hanya diterjemahkan ke internal standard melalui Adapter.

---

# 5. AUTHENTICATION

Login utama:

> **Google Sign-In / Google OAuth**

User tetap memiliki nomor HP untuk:

- transaksi;
- WhatsApp;
- notifikasi;
- recovery/contact;
- KYC;
- kebutuhan operasional.

Contoh tabel user:

```text
users
- id
- name
- email
- google_id
- phone
- avatar
- role
- status
- email_verified_at
- timestamps
```

Authentication harus dapat dikembangkan ke:

- Google OAuth
- email verification
- transaction PIN
- biometric
- device management
- admin 2FA

---

# 6. ROLE & PERMISSION

Sistem menggunakan Role Based Access Control.

Contoh role:

```text
SUPER ADMIN
ADMIN
OPERATOR
CASHIER
AGENT
RESELLER
USER
```

Permission dipisahkan dari role agar fleksibel.

Contoh:

```text
view_dashboard
manage_users
manage_products
manage_prices
manage_providers
view_transactions
approve_deposit
manage_wallet
view_profit
manage_reports
manage_theme
manage_tenant
```

---

# 7. CLIENT PWA

Client PWA adalah aplikasi utama pengguna.

Dapat digunakan melalui:

- Android
- Windows
- Tablet
- Laptop
- Browser
- Install sebagai PWA

Fitur utama:

- Login Google
- Dashboard
- Saldo
- Top Up
- Pulsa
- Paket Data
- Produk PPOB
- Checkout
- Riwayat transaksi
- Detail transaksi
- Status transaksi
- Profil
- Notifikasi
- Bantuan
- KYC
- Transfer
- Pengaturan

PWA menggunakan HTTPS, manifest, service worker dan responsive design.

Offline hanya untuk fungsi non-kritis.

Transaksi tetap membutuhkan server sebagai source of truth.

---

# 8. ADMIN PWA

Admin PWA digunakan untuk operasional platform.

Modul:

- Dashboard
- Users
- Agent / Reseller
- Products
- Categories
- Prices
- Providers
- Provider Mapping
- Provider Health
- Transactions
- Wallet
- Deposits
- Payment Gateway
- WhatsApp
- Notifications
- Commissions
- Promotions
- Reports
- KYC
- Remittance
- VPN
- Theme
- Branding
- Tenant
- Logs
- Audit
- Settings

---

# 9. THEME ENGINE / DESIGN SYSTEM

## KEPUTUSAN DIKUNCI

Seluruh UI harus menggunakan:

> **Centralized Theme Engine / Design Tokens**

Tidak boleh setiap halaman memiliki warna dan styling utama yang dibuat sendiri-sendiri.

Contoh:

```text
--primary
--secondary
--accent
--background
--surface
--card
--text
--text-muted
--border
--success
--warning
--danger
--info
--radius
--shadow
```

Theme Engine mengatur:

- primary color;
- secondary color;
- accent;
- background;
- surface;
- card;
- text;
- muted text;
- border;
- shadow;
- radius;
- typography;
- button;
- form;
- sidebar;
- header;
- status;
- light mode;
- dark mode;
- system mode;
- logo;
- favicon;
- branding.

Satu perubahan tema harus memengaruhi seluruh aplikasi.

---

# 10. WHITE LABEL

Platform harus siap menjadi:

> **One Core — Many Brands**

Tenant dapat memiliki:

- nama brand;
- logo;
- favicon;
- warna;
- tema;
- domain;
- subdomain;
- WhatsApp;
- payment gateway;
- pricing;
- produk;
- supplier;
- aturan transaksi.

Tidak perlu fork source code.

---

# 11. MULTI-TENANT SAAS

Tenant memiliki isolasi data.

Contoh:

```text
Tenant A
 ├── Users
 ├── Wallets
 ├── Transactions
 ├── Products
 ├── Prices
 ├── Agents
 └── Branding

Tenant B
 ├── Users
 ├── Wallets
 ├── Transactions
 ├── Products
 ├── Prices
 ├── Agents
 └── Branding
```

Core aplikasi tetap sama.

---

# 12. WALLET

Wallet digunakan untuk saldo user/agent/reseller.

Jenis transaksi:

```text
CREDIT
DEBIT
REFUND
ADJUSTMENT
DEPOSIT
WITHDRAWAL
```

Saldo tidak boleh diubah secara langsung tanpa ledger.

Prinsip:

> **Wallet Balance harus dapat ditelusuri melalui Wallet Ledger.**

---

# 13. DEPOSIT OTOMATIS

Alur:

```text
User
 ↓
Pilih nominal
 ↓
Payment Gateway
 ↓
QRIS / VA / metode pembayaran
 ↓
User membayar
 ↓
Gateway Webhook
 ↓
Laravel verifikasi
 ↓
Idempotency check
 ↓
Wallet CREDIT
 ↓
Notification
```

Saldo hanya bertambah setelah callback terverifikasi.

---

# 14. DEPOSIT MANUAL

Alur:

```text
User membuat deposit ticket
        ↓
WAITING_PAYMENT
        ↓
Transfer bank
        ↓
Upload bukti
        ↓
PROOF_RECEIVED
        ↓
Admin review
        ↓
APPROVED
        ↓
Wallet CREDIT
```

Status:

```text
PENDING
WAITING_PAYMENT
PROOF_RECEIVED
UNDER_REVIEW
APPROVED
REJECTED
```

**Screenshot bukti transfer tidak otomatis menambah saldo.**

Semua approval memiliki audit trail.

---

# 15. PPOB ENGINE

MVP dimulai dari:

1. Pulsa
2. Paket Data

Kemudian berkembang:

- PLN
- E-Wallet
- BPJS
- PDAM
- TELKOM
- Multifinance
- TV
- Internet
- Games
- Voucher
- Produk digital lainnya

Core transaction engine harus generik.

---

# 16. TRANSACTION STATE

Backend menggunakan technical state:

```text
PENDING
PROCESSING
SUCCESS
FAILED
UNKNOWN
REFUND
```

Tetapi user cukup melihat:

```text
🟢 SUKSES
🔴 GAGAL
🟠 REFUND
```

Status teknis tetap disimpan untuk keamanan dan troubleshooting.

---

# 17. IDEMPOTENCY / ANTI DOUBLE TRANSACTION

Setiap transaksi harus memiliki identifier unik.

Contoh:

```text
transaction_id
idempotency_key
provider_reference
customer_reference
```

Sistem harus mencegah:

- double click;
- retry duplicate;
- duplicate webhook;
- duplicate callback;
- transaksi ganda akibat timeout.

---

# 18. TIMEOUT DAN UNKNOWN

Jika provider timeout:

> Jangan langsung melakukan retry ke provider lain.

Karena supplier mungkin sebenarnya telah menerima transaksi.

Flow:

```text
PURCHASE
   ↓
TIMEOUT
   ↓
UNKNOWN
   ↓
CHECK STATUS
   ↓
SUCCESS / FAILED / UNKNOWN
```

Jika status tetap tidak diketahui, transaksi masuk proses investigasi/recovery.

---

# 19. H2H PROVIDER ARCHITECTURE

Supplier saat ini:

- Digiflazz
- Orderkuota

Supplier berikutnya dapat ditambahkan.

Core tidak boleh bergantung pada format supplier.

---

# 20. PROVIDER ADAPTER

Setiap supplier mempunyai Adapter.

```text
Core Transaction
       │
       ▼
Provider Manager
       │
 ┌─────┴─────┐
 ▼           ▼
Digiflazz   Orderkuota
Adapter     Adapter
 │           │
 ▼           ▼
API         API
```

Digiflazz Adapter bertugas menerjemahkan:

```text
Internal Standard
        ↓
Digiflazz Request
        ↓
Digiflazz Response
        ↓
Internal Standard
```

Orderkuota melakukan hal yang sama.

Core tidak mengetahui:

- endpoint supplier;
- signature;
- request format;
- response format;
- callback format;
- kode produk supplier.

---

# 21. PROVIDER OPERATIONS

Standard internal:

```text
CHECK BALANCE
GET PRODUCTS
GET PRICE
PURCHASE
CHECK STATUS
CALLBACK
```

---

# 22. PROVIDER HEALTH

Provider memiliki status:

```text
ONLINE
DEGRADED
OFFLINE
MAINTENANCE
UNKNOWN
```

Health monitoring menyimpan:

- response time;
- error;
- timeout;
- success rate;
- balance;
- maintenance;
- product availability.

---

# 23. SMART ROUTING

Smart Routing memilih provider berdasarkan aturan.

Pertimbangan:

- provider online;
- product available;
- provider health;
- supplier balance;
- cost price;
- priority;
- reliability;
- maintenance;
- tenant rule.

Contoh:

```text
Product PULSA-50K
       │
       ├── Digiflazz Rp 49.000
       ├── Orderkuota Rp 48.800
       └── Provider C Rp 49.200

Health Check
       ↓
Provider sehat
       ↓
Cost terbaik
       ↓
Provider dipilih
```

Routing tidak boleh mengorbankan keamanan transaksi.

---

# 24. PRODUCT MAPPING

Core menggunakan kode internal.

Contoh:

```text
PULSA-TSEL-50K
PULSA-XL-50K
DATA-TSEL-10GB
```

Supplier memiliki kode masing-masing.

Mapping:

```text
internal_product_id
provider_id
provider_product_code
provider_price
status
```

---

# 25. PRICE MAPPING

Harga supplier dapat berbeda.

Sistem dapat menyimpan:

```text
provider cost
selling price
margin
tenant price
agent price
reseller price
```

---

# 26. TRANSACTION PRICE SNAPSHOT

Saat transaksi berhasil dibuat, sistem menyimpan snapshot:

```text
selling_price
supplier_cost
fee
commission
gross_profit
net_profit
```

Harga supplier yang berubah di kemudian hari tidak boleh mengubah histori transaksi lama.

---

# 27. KASIR & PROFIT

Sistem mendukung:

- kasir;
- operator;
- multi-cashier;
- penjualan;
- modal;
- profit;
- refund;
- laporan.

Laporan:

- profit harian;
- profit bulanan;
- profit tahunan;
- profit per produk;
- profit per provider;
- profit per kasir;
- transaksi per kasir;
- refund;
- modal supplier.

---

# 28. AGENT / RESELLER

Tahap berikutnya:

- Agent
- Reseller
- Level harga
- Komisi
- Referral
- Pricing tier
- Limit transaksi
- Saldo agent

Contoh:

```text
Retail
Agent Bronze
Agent Silver
Agent Gold
```

Struktur harga dibuat configurable.

---

# 29. PAYMENT GATEWAY

Payment Gateway menjadi integration layer.

Dapat mendukung:

- QRIS;
- Virtual Account;
- transfer;
- metode pembayaran lain.

Flow:

```text
PWA
 ↓
Laravel
 ↓
Payment Gateway
 ↓
Customer Payment
 ↓
Webhook
 ↓
Laravel Verification
 ↓
Wallet
```

Webhook harus:

- diverifikasi;
- idempotent;
- dicatat;
- memiliki audit log.

---

# 30. WHATSAPP GATEWAY

WhatsApp Gateway dibuat sebagai module terpisah dan berpotensi menjadi SaaS sendiri.

Fitur:

- API key;
- connection;
- WhatsApp session;
- multi-session;
- text;
- image;
- document;
- video;
- media;
- webhook;
- delivery status;
- logs;
- dashboard;
- usage;
- quota;
- billing;
- subscription;
- contacts;
- templates;
- documentation.

PPOB menggunakan WhatsApp Gateway untuk:

- deposit;
- transaksi;
- status;
- refund;
- promo;
- notifikasi.

Arsitektur harus provider/engine agnostic.

---

# 31. NOTIFICATION ENGINE

Channel:

```text
PUSH
EMAIL
WHATSAPP
```

Event dapat menghasilkan notification melalui queue.

Contoh:

```text
Deposit Approved
Transaction Success
Transaction Failed
Refund
Promotion
KYC Update
VPN Expiration
```

---

# 32. KYC

KYC masuk tahap lanjutan.

Status:

```text
NOT_STARTED
PENDING
NEED_REVISION
REJECTED
VERIFIED
EXPIRED
```

Komponen:

- identity;
- ID document;
- OCR;
- review;
- selfie/liveness;
- audit;
- risk check.

---

# 33. REMITTANCE

Remittance dipisahkan dari PPOB engine.

Contoh tabel/module:

```text
transfer_transactions
kyc_profiles
kyc_documents
beneficiaries
exchange_rates
transfer_fees
risk_checks
```

Setiap transfer harus memeriksa:

```text
KYC = VERIFIED
```

sebelum transfer diproses.

---

# 34. LOCAL BANK TRANSFER

Flow:

```text
Input rekening
      ↓
Account Inquiry
      ↓
Nama penerima
      ↓
User confirmation
      ↓
KYC / risk check
      ↓
Transfer
```

Nama penerima harus ditampilkan sebelum konfirmasi jika provider mendukung account inquiry.

---

# 35. FOREIGN CURRENCY TRANSFER

Sistem menyimpan snapshot:

```text
currency
exchange_rate
fee
amount
destination_amount
provider_cost
timestamp
```

Rate historis transaksi tidak berubah ketika rate baru masuk.

---

# 36. RISK ENGINE

Risk engine digunakan untuk:

- limit transaksi;
- velocity check;
- anomaly;
- unusual activity;
- manual review;
- KYC risk;
- transfer risk.

---

# 37. VPN SAAS

VPN adalah produk terpisah tetapi dapat menggunakan core SaaS.

Target:

- remote MikroTik;
- remote server;
- CCTV;
- NAS;
- LAN;
- akses jaringan internal.

Teknologi yang direncanakan:

> WireGuard

Laravel mengelola:

- user;
- subscription;
- payment;
- VPN profile;
- device;
- permissions;
- expiration;
- audit.

VPN server/controller mengelola tunnel.

Flow:

```text
Payment
 ↓
Webhook
 ↓
Laravel
 ↓
Subscription Active
 ↓
VPN Enabled
```

Saat expired:

```text
Subscription Expired
 ↓
VPN Disabled
```

---

# 38. REPORTING

Laporan:

- transaksi;
- penjualan;
- modal;
- profit;
- deposit;
- refund;
- commission;
- provider;
- user;
- agent;
- cashier;
- tenant.

Export dapat dikembangkan ke:

- Excel;
- CSV;
- PDF.

---

# 39. AUDIT LOG

Aktivitas penting harus dicatat.

Contoh:

```text
login
logout
deposit approval
deposit rejection
wallet adjustment
transaction update
transaction refund
price update
provider update
theme update
user update
KYC approval
admin action
```

Audit minimal:

```text
user
tenant
action
module
record_id
old_value
new_value
IP
user_agent
timestamp
```

---

# 40. DATABASE ARCHITECTURE

## AUTH

```text
users
roles
permissions
role_permissions
user_roles
sessions
devices
```

## TENANT

```text
tenants
tenant_settings
tenant_domains
tenant_branding
tenant_themes
```

## WALLET

```text
wallets
wallet_transactions
deposits
deposit_proofs
```

## PRODUCT

```text
categories
products
product_prices
product_provider_mappings
```

## PROVIDER

```text
providers
provider_credentials
provider_products
provider_transactions
provider_callbacks
provider_balance_logs
provider_error_logs
provider_health_logs
```

## TRANSACTION

```text
transactions
transaction_items
transaction_status_logs
transaction_audits
refunds
```

## AGENT

```text
agents
agent_levels
agent_prices
commissions
referrals
```

## PAYMENT

```text
payment_gateways
payment_transactions
payment_callbacks
```

## NOTIFICATION

```text
notifications
notification_templates
notification_logs
```

## WHATSAPP

```text
whatsapp_accounts
whatsapp_sessions
whatsapp_messages
whatsapp_webhooks
whatsapp_api_keys
```

## KYC

```text
kyc_profiles
kyc_documents
kyc_reviews
risk_checks
```

## REMITTANCE

```text
transfer_transactions
beneficiaries
exchange_rates
transfer_fees
```

## VPN

```text
vpn_products
vpn_subscriptions
vpn_devices
vpn_profiles
vpn_audit_logs
```

## REPORT

```text
report_jobs
report_exports
```

## SYSTEM

```text
settings
audit_logs
activity_logs
```

---

# 41. API ARCHITECTURE

API menggunakan versioning.

Contoh:

```text
/api/v1/auth
/api/v1/users
/api/v1/wallet
/api/v1/deposits
/api/v1/products
/api/v1/transactions
/api/v1/providers
/api/v1/reports
/api/v1/notifications
```

Future:

```text
/api/v2/...
```

API harus memiliki:

- authentication;
- authorization;
- validation;
- rate limiting;
- idempotency;
- logging;
- consistent response;
- error handling.

---

# 42. SERVICE LAYER

Business logic tidak diletakkan seluruhnya di Controller.

Contoh:

```text
TransactionService
WalletService
DepositService
ProviderManager
RoutingService
PricingService
NotificationService
PaymentService
KycService
RemittanceService
VpnService
ReportService
```

Controller bertugas sebagai interface/API layer.

---

# 43. QUEUE / BACKGROUND JOB

Proses berat menggunakan queue.

Contoh:

```text
SendWhatsAppJob
SendNotificationJob
ProviderTransactionJob
ProviderStatusCheckJob
PaymentWebhookJob
ReportExportJob
KycProcessingJob
VpnProvisionJob
```

Tujuannya agar API tetap cepat dan stabil.

---

# 44. CACHE

Cache digunakan untuk:

- product list;
- price;
- provider health;
- settings;
- theme;
- tenant configuration;
- exchange rate.

Data transaksi tetap berasal dari database/source of truth.

---

# 45. PWA OFFLINE

Offline digunakan secara terbatas.

Boleh:

- cache UI;
- cache asset;
- cache konfigurasi non-kritis;
- skeleton/offline screen.

Tidak boleh menganggap transaksi offline sebagai transaksi final.

---

# 46. FRONTEND / UI LIBRARY

**Belum dikunci.**

Kandidat yang sudah dibahas:

### Vue + PrimeVue

Kelebihan:

- Vue ecosystem;
- business/admin friendly;
- DataTable;
- forms;
- charts;
- responsive.

### React + shadcn/ui + Tailwind

Kelebihan:

- sangat customizable;
- design ownership berada di project;
- cocok untuk white-label;
- modern;
- fleksibel.

Alternatif yang pernah dibandingkan:

- Smart.UI
- Vuetify
- MUI
- Ant Design

Keputusan final frontend/UI akan dibuat pada Technical Blueprint.

---

# 47. GIT & DEVELOPMENT WORKFLOW

Repository GitHub dibuat sejak awal.

Workflow:

```text
LOCAL
  ↓
CODING
  ↓
TESTING
  ↓
git add
  ↓
git commit
  ↓
git push
  ↓
GITHUB
  ↓
STAGING / SERVER
  ↓
PRODUCTION
```

`.env` tidak boleh masuk repository.

Yang boleh:

```text
.env.example
```

Repository PPOB dibuat terpisah dari repository aplikasi Money Changer.

---

# 48. ENVIRONMENT

Minimal:

```text
LOCAL
STAGING
PRODUCTION
```

Setiap environment memiliki:

- database;
- API credentials;
- payment credentials;
- provider credentials;
- WhatsApp credentials;
- domain;
- logging;
- queue.

---

# 49. BACKUP & RECOVERY

Backup harus mencakup:

- database;
- uploaded documents;
- KYC documents;
- transaction records;
- configuration;
- tenant data.

Prinsip:

```text
Production
    ↓
Backup
    ↓
Offsite / Secondary Storage
```

Harus tersedia prosedur restore.

---

# 50. ROADMAP

## MVP 1 — CORE

```text
Laravel
MySQL
Google Login
User
Wallet
Manual Deposit
Pulsa
Paket Data
Transaction History
Client PWA
Admin PWA
Basic Theme Engine
```

## MVP 2 — PPOB AUTOMATION

```text
Provider API
Digiflazz
Orderkuota
Automated Transaction
PLN
E-Wallet
Payment Gateway
Push Notification
Cashier
Profit
Smart Routing
```

## MVP 3 — BUSINESS

```text
Agent
Reseller
Price Levels
Commission
Referral
WhatsApp
Promotion
Advanced Reporting
Multi Cashier
```

## V2 — SAAS

```text
Multi Provider
Advanced Routing
Multi Tenant
White Label
Tenant Theme
Reseller API
Advanced Reporting
Subscription
```

## V3 — FINANCIAL SERVICES

```text
KYC
Remittance
Bank Transfer
FX Transfer
Risk Engine
VPN SaaS
Additional Digital Services
Additional Providers
```

---

# 51. URUTAN PENAMBAHAN SUPPLIER

Supplier baru tidak boleh mengubah core.

Urutan:

```text
Core Transaction Engine
        ↓
Provider Interface
        ↓
Provider Adapter
        ↓
Provider Mapping
        ↓
Health Monitoring
        ↓
Smart Routing
```

Menambah supplier berarti membuat Adapter baru.

---

# 52. URUTAN PENAMBAHAN FITUR

Fitur baru harus mengikuti:

```text
Database
   ↓
Model
   ↓
Service
   ↓
API
   ↓
Permission
   ↓
Queue / Event jika perlu
   ↓
Frontend
   ↓
Notification
   ↓
Audit
   ↓
Report
```

---

# 53. PRINSIP SAAS

Core platform:

> **One Core — Many Tenants**

Tenant tidak boleh membutuhkan fork source code.

Perbedaan tenant disimpan sebagai:

```text
configuration
settings
branding
theme
pricing
provider rules
feature flags
domain
```

---

# 54. PRINSIP WHITE LABEL

Tenant dapat mengganti:

```text
Brand Name
Logo
Favicon
Primary Color
Secondary Color
Accent
Theme
Domain
WhatsApp
Payment Gateway
Product
Pricing
```

Tanpa mengubah source code core.

---

# 55. PRINSIP GLOBAL UI

Semua halaman harus menggunakan:

```text
Design Tokens
Theme Engine
Shared Components
```

Contoh:

```text
Button
Input
Select
Modal
Card
Table
Badge
Alert
Sidebar
Header
Form
```

Tidak membuat style utama yang berbeda-beda secara manual di setiap halaman.

---

# 56. SECURITY

Minimum:

- HTTPS;
- Google OAuth;
- API authentication;
- role permission;
- transaction PIN;
- admin 2FA;
- rate limiting;
- webhook signature verification;
- idempotency;
- audit log;
- activity log;
- device/login log;
- secure credential storage;
- encrypted sensitive data;
- backup;
- monitoring.

---

# 57. DEFINITION OF DONE

Sebuah fitur dianggap selesai jika:

```text
Database
✓

Backend Model
✓

Service
✓

API
✓

Validation
✓

Permission
✓

Audit
✓

Error Handling
✓

Queue jika diperlukan
✓

Notification jika diperlukan
✓

Frontend
✓

Responsive
✓

Theme Engine
✓

Testing
✓

Documentation
✓
```

---

# 58. GOLDEN RULES

## Rule 1

> **Laravel adalah source of truth.**

## Rule 2

> **Client tidak mengakses database langsung.**

## Rule 3

> **Supplier tidak boleh menentukan struktur core.**

## Rule 4

> **Supplier harus melalui Adapter.**

## Rule 5

> **Jangan retry transaksi UNKNOWN secara membabi buta.**

## Rule 6

> **Semua transaksi harus idempotent.**

## Rule 7

> **Wallet harus menggunakan ledger.**

## Rule 8

> **Saldo tidak boleh bertambah hanya karena tiket atau screenshot deposit.**

## Rule 9

> **Historical supplier cost harus disimpan sebagai snapshot.**

## Rule 10

> **Theme Engine harus menjadi pusat styling.**

## Rule 11

> **White-label tidak boleh membutuhkan fork source code.**

## Rule 12

> **Fitur baru harus masuk melalui architecture yang sudah ditentukan.**

---

# 59. TARGET ARCHITECTURE

```text
                         ┌──────────────────────┐
                         │       USERS          │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │   CLIENT PWA         │
                         │   ADMIN PWA          │
                         └──────────┬───────────┘
                                    │
                              HTTPS / API
                                    │
                         ┌──────────▼───────────┐
                         │      LARAVEL         │
                         │       CORE           │
                         └──────────┬───────────┘
                                    │
       ┌──────────────┬─────────────┼──────────────┬──────────────┐
       │              │             │              │              │
       ▼              ▼             ▼              ▼              ▼
    AUTH           WALLET         PPOB         PAYMENT        NOTIFICATION
       │              │             │              │              │
       │              │             ▼              │              │
       │              │       PROVIDER MANAGER     │              │
       │              │             │              │              │
       │              │      ┌──────┴──────┐       │              │
       │              │      ▼             ▼       │              │
       │              │  DIGIFLAZZ    ORDERKUOTA   │              │
       │              │                             │              │
       └──────────────┴──────────────┬──────────────┴──────────────┘
                                     │
                              MYSQL DATABASE
                                     │
                           AUDIT / REPORTING
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
                 KYC              REMITTANCE          VPN
```

---

# 60. STATUS BLUEPRINT

## MASTER BLUEPRINT

**STATUS: FINAL**

Blueprint ini sudah final pada level:

- architecture;
- product direction;
- core modules;
- security principles;
- PPOB architecture;
- provider architecture;
- SaaS architecture;
- white-label architecture;
- Theme Engine;
- roadmap.

## TECHNICAL BLUEPRINT

**STATUS: BELUM FINAL**

Masih harus dikunci sebelum coding besar dimulai:

1. Frontend framework.
2. UI component library.
3. Detail database schema.
4. API contract.
5. Payment Gateway provider.
6. WhatsApp engine/provider.
7. Production infrastructure.
8. Supplier API credentials/detail implementation.
9. KYC provider.
10. VPN infrastructure.

---

# 61. LANGKAH PENGEMBANGAN BERIKUTNYA

Setelah Master Blueprint ini:

```text
MASTER BLUEPRINT
       ↓
TECHNICAL BLUEPRINT
       ↓
DATABASE DESIGN
       ↓
API CONTRACT
       ↓
PROJECT SCAFFOLD
       ↓
AUTH
       ↓
TENANT
       ↓
THEME ENGINE
       ↓
WALLET
       ↓
PPOB ENGINE
       ↓
PROVIDER ADAPTER
       ↓
CLIENT PWA
       ↓
ADMIN PWA
       ↓
TESTING
       ↓
DEPLOYMENT
```

---

# 62. KESIMPULAN

Platform dibangun dengan prinsip:

> **Build once, extend many times.**

Core harus tetap stabil.

Supplier dapat ditambah.

Produk dapat ditambah.

Tenant dapat ditambah.

Brand dapat ditambah.

Theme dapat diubah.

Payment provider dapat diganti.

WhatsApp provider dapat diganti.

Fitur dapat berkembang.

Semua dilakukan tanpa menghancurkan core architecture.

---

## STATUS DOKUMEN

**MASTER BLUEPRINT PPOB SAAS — FINAL ARCHITECTURE**

Dokumen ini menjadi acuan utama sebelum masuk ke:

> **TECHNICAL BLUEPRINT v1.0**
