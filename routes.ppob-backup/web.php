<?php

use App\Http\Controllers\Admin\AdminPanelController;
use Illuminate\Support\Facades\Route;

Route::get('/admin', [AdminPanelController::class, 'index'])->name('admin.dashboard');
