<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\PageController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\LinkController;
use App\Http\Controllers\Admin\DashboardController;
use Inertia\Inertia;

// --- GUEST ROUTES ---
Route::get('/', [PageController::class, 'chat'])->name('home');
Route::get('/dokumen', [PageController::class, 'documents'])->name('guest.documents');
Route::get('/dokumen/download/{id}', [PageController::class, 'downloadDocument'])->name('guest.documents.download');
Route::get('/info-syarat', [PageController::class, 'info'])->name('guest.info');

// --- ADMIN ROUTES ---
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.') 
    ->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // CRUD Resources (Otomatis generate: admin.documents.index, admin.documents.store, dll)
    Route::resource('documents', DocumentController::class);
    Route::resource('announcements', AnnouncementController::class);
    Route::resource('links', LinkController::class);
});

require __DIR__.'/settings.php';