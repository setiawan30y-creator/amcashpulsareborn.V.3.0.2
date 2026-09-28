<?php

use App\Http\Controllers\Admin\AdminPanelController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('admin.dashboard'));

Route::get('/admin', [AdminPanelController::class, 'index'])->name('admin.dashboard');
