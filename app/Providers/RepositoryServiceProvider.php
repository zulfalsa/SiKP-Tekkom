<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Repositories\EloquentRepositoryDocument;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(DocumentRepositoryInterface::class, EloquentRepositoryDocument::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}