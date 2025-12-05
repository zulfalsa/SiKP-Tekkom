<?php

namespace App\Services\Abstracts;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\DocumentFailureException;
use Symfony\Component\HttpFoundation\StreamedResponse;

abstract class AbstractFileService
{
    protected string $disk = 'public'; 

    abstract protected function getStoragePath(): string;

    public function upload(UploadedFile $file): string
    {
        try {
            $path = $file->store($this->getStoragePath(), $this->disk);
            
            if (!$path) {
                throw DocumentFailureException::uploadFailed($file->getClientOriginalName());
            }

            return $path;
        } catch (\Throwable $e) {
            throw DocumentFailureException::uploadFailed($file->getClientOriginalName());
        }
    }

    public function delete(string $path): void
    {
        if (Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }
    }
    
    /**
     * Logika download dengan nama file kustom
     * * @param string $path
     * @param string|null $customFilename
     * @return StreamedResponse
     * @throws DocumentFailureException
     */
    public function getDownloadLink(string $path, ?string $customFilename = null)
    {
        if (!Storage::disk($this->disk)->exists($path)) {
             throw DocumentFailureException::fileNotFound();
        }
        
        // Jika custom filename diberikan, gunakan itu. Jika tidak, pakai nama asli file.
        $name = $customFilename 
            ? $customFilename . '.' . pathinfo($path, PATHINFO_EXTENSION) 
            : null;

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($this->disk);

        return $storage->download($path, $name);
    }
}