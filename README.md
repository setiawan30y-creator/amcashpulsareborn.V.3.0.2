# Almara PPOB SaaS — Sprint 1 + Admin Panel Integrated

Project ini menggabungkan Laravel Core Sprint 1 dengan Admin Panel PPOB.

## Admin Panel

URL:
`/admin`

UI mengikuti modul Admin PWA pada BLUEPRINT_MASTER_PPOB_SAAS.md:
- Dashboard
- Users
- Agent / Reseller
- Products
- Categories
- Prices
- Transactions
- Wallet
- Deposits
- Providers
- Provider Mapping
- Provider Health
- Smart Routing
- Payment Gateway
- WhatsApp
- Notifications
- Commissions
- Promotions
- Reports
- Tenants
- Branding
- Theme Engine
- KYC
- Remittance
- VPN
- Audit / Logs
- Settings

## Theme Engine

Seluruh UI memakai CSS design tokens terpusat (`:root`). Theme Engine menjadi pusat styling untuk primary, secondary, accent, surface, card, text, status, radius, dan shadow.

## Laravel Integration

Admin UI disajikan dari Laravel Blade melalui:
`GET /admin`

API tetap berada pada:
`/api/v1/*`

Admin UI tidak mengakses database secara langsung. Integrasi data diarahkan melalui Laravel API.

## Run

1. Copy isi project ke `C:\laragon\www\amcashpulsareborn`.
2. Pastikan PHP 8.4+ dan Composer tersedia.
3. Jalankan `composer install`.
4. Copy `.env.example` menjadi `.env` dan isi database.
5. Jalankan `php artisan key:generate`.
6. Jalankan migration dan seeder setelah database siap.
7. Buka `http://amcashpulsareborn.test/admin` (sesuaikan domain Laragon).

Catatan: autentikasi UI Admin dan semua CRUD masih tahap berikutnya. Sprint ini memprioritaskan shell Admin, Theme Engine, tenant-aware API foundation, RBAC, wallet ledger, dan deposit foundation.
