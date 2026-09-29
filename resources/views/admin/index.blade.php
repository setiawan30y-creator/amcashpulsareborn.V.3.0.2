<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b1220">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Almara PPOB — Admin</title>
    <link rel="preload" href="{{ asset('admin/assets/app.css') }}" as="style">
    <link rel="stylesheet" href="{{ asset('admin/assets/app.css') }}?v={{ file_exists(public_path('admin/assets/app.css')) ? filemtime(public_path('admin/assets/app.css')) : '1' }}">
</head>
<body>
<div class="app-shell" id="appShell">
    <aside class="sidebar" id="sidebar">
        <div class="brand">
            <div class="brand-mark">A</div>
            <div><strong>ALMARA</strong><span>PPOB SAAS</span></div>
            <button class="sidebar-close" id="sidebarClose">×</button>
        </div>
        <div class="tenant-switcher">
            <div class="tenant-avatar">AP</div>
            <div><b>Almara Platform</b><small>Platform Owner</small></div>
            <span>⌄</span>
        </div>
        <nav class="nav" id="nav"></nav>
        <div class="sidebar-footer">
            <span class="status-dot"></span><div><b>Core API</b><small id="apiStatus">Checking…</small></div>
        </div>
    </aside>
    <main class="main">
        <header class="topbar">
            <div class="top-left">
                <button class="icon-btn mobile-only" id="menuBtn">☰</button>
                <div class="breadcrumbs"><span>Admin</span><b>/</b><strong id="pageTitle">Dashboard</strong></div>
            </div>
            <div class="top-actions">
                <button class="icon-btn" title="Search">⌕</button>
                <button class="icon-btn notification" title="Notifications">◔<i></i></button>
                <div class="profile"><div class="avatar">SA</div><div class="profile-copy"><strong>Super Admin</strong><small>Platform Owner</small></div><span>⌄</span></div>
            </div>
        </header>
        <section class="content" id="content"></section>
    </main>
</div>
<script>window.ALMARA={apiBase:@json(url('/api/v1')), csrf:@json(csrf_token())};</script>
<script src="{{ asset('admin/assets/app.js') }}?v={{ file_exists(public_path('admin/assets/app.js')) ? filemtime(public_path('admin/assets/app.js')) : '1' }}" defer></script>
</body>
</html>
