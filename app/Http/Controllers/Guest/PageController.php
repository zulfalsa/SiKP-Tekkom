<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use App\Repositories\Interfaces\LinkRepositoryInterface;
use App\Services\RepositoryDocumentService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Announcement; // Pastikan import Model Announcement ada jika dipakai di welcome()
use App\Exceptions\DocumentFailureException;

class PageController extends Controller
{
    public function __construct(
        protected DocumentRepositoryInterface $documentRepo,
        protected AnnouncementRepositoryInterface $announcementRepo,
        protected LinkRepositoryInterface $linkRepo,
        protected RepositoryDocumentService $fileService
    ) {}

    public function chat()
    {
        $announcements = $this->announcementRepo->getAllActive()->take(3);
        
        return Inertia::render('guest/chat-assistant', [
            'announcements' => $announcements,
            'canLogin' => true,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function documents()
    {
        return Inertia::render('guest/documents', [
            'documents' => $this->documentRepo->getAllActive(),
            'links' => $this->linkRepo->getAll(), 
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function info()
    {
        return Inertia::render('guest/info', [
            'announcements' => $this->announcementRepo->getAllActive(),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function downloadDocument($id)
    {
        $document = $this->documentRepo->find($id);

        if (!$document) {
            abort(404);
        }

        try {
            return $this->fileService->getDownloadLink($document->file_path, $document->title);
        } catch (DocumentFailureException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}