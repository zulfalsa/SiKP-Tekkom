<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use App\Repositories\Interfaces\LinkRepositoryInterface;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DocumentRepositoryInterface $docs,
        protected AnnouncementRepositoryInterface $announcements,
        protected LinkRepositoryInterface $links
    ) {}

    public function index()
    {
        return Inertia::render('dashboard', [
            'documents' => $this->docs->getAllActive(),
            'announcements' => $this->announcements->getAllActive(),
            'links' => $this->links->getAll(),
        ]);
    }
}