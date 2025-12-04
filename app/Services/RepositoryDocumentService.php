<?php

namespace App\Services;

use App\Services\Abstracts\AbstractFileService;

class RepositoryDocumentService extends AbstractFileService
{
    // Implementasi abstract method (Polymorphism)
    protected function getStoragePath(): string
    {
        // File akan disimpan di folder 'repository-docs' di storage
        return 'repository-docs';
    }
}