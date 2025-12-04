<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Guest\PageController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\AnnouncementController; // Asumsi controller ini dibuat serupa DocumentController
use Inertia\Inertia;

// --- GUEST ROUTES (Mahasiswa) ---
Route::get('/', [PageController::class, 'welcome'])->name('home');
Route::get('/dokumen', [PageController::class, 'documents'])->name('guest.documents');
Route::get('/dokumen/download/{id}', [PageController::class, 'downloadDocument'])->name('guest.documents.download');
Route::get('/info-syarat', [PageController::class, 'info'])->name('guest.info');


// --- ADMIN ROUTES (Koordinator KP) ---
// Menggunakan middleware 'auth' bawaan starter kit
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    
    // Dashboard Admin
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard'); // Halaman Dashboard Admin sesuai Figma
    })->name('dashboard');

    // Manajemen Dokumen (CRUD)
    Route::get('/documents', [DocumentController::class, 'index'])->name('admin.documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('admin.documents.store');
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy'])->name('admin.documents.destroy');

    // Manajemen Pengumuman (CRUD) - Logic serupa dengan Document
    // Route::resource('announcements', AnnouncementController::class);
});

// Include rute setting bawaan starter kit
require __DIR__.'/settings.php';