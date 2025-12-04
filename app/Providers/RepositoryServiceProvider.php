<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Repositories\EloquentRepositoryDocument;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use App\Repositories\EloquentAnnouncementRepository;
use App\Repositories\Interfaces\LinkRepositoryInterface;
use App\Repositories\EloquentLinkRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind Dokumen
        $this->app->bind(DocumentRepositoryInterface::class, EloquentRepositoryDocument::class);
        
        // Bind Pengumuman
        $this->app->bind(AnnouncementRepositoryInterface::class, EloquentAnnouncementRepository::class);

        // Bind Link Eksternal
        $this->app->bind(LinkRepositoryInterface::class, EloquentLinkRepository::class);
    }

    public function boot(): void
    {
        //
    }
}