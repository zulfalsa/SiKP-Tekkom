<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Services\RepositoryDocumentService;
use Inertia\Inertia;
use App\Models\Announcement; 
use App\Exceptions\DocumentFailureException;

class PageController extends Controller
{
    protected $documentRepo;
    protected $fileService;

    public function __construct(
        DocumentRepositoryInterface $documentRepo,
        RepositoryDocumentService $fileService
    ) {
        $this->documentRepo = $documentRepo;
        $this->fileService = $fileService;
    }

    // Halaman Landing / Dashboard Mahasiswa
    public function welcome()
    {
        // Ambil pengumuman aktif (tanpa repository pattern yg kompleks karena sederhana)
        $announcements = Announcement::where('is_active', true)
                        ->orderBy('created_at', 'desc')
                        ->take(3)
                        ->get();

        return Inertia::render('welcome', [
            'announcements' => $announcements,
            'canLogin' => true, 
        ]);
    }

    // Halaman Pusat Dokumen & Formulir
    public function documents()
    {
        $documents = $this->documentRepo->getAllActive();
        
        return Inertia::render('guest/documents', [
            'documents' => $documents
        ]);
    }

    // Fitur Download Dokumen
    public function downloadDocument($id)
    {
        $document = $this->documentRepo->find($id);

        if (!$document) {
            abort(404);
        }

        try {
            return $this->fileService->getDownloadLink($document->file_path);
        } catch (DocumentFailureException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    // Halaman Info & Syarat
    public function info()
    {
        $announcements = Announcement::where('is_active', true)
                        ->orderBy('created_at', 'desc')
                        ->get();
                        
        return Inertia::render('guest/info', [
            'announcements' => $announcements
        ]);
    }
}