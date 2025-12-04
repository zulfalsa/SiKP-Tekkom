<?php

namespace App\Services\Abstracts;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\DocumentFailureException;

abstract class AbstractFileService
{
    protected string $disk = 'public';

    /**
     * Method abstract yang harus diimplementasikan oleh child class
     * untuk menentukan folder penyimpanan (Polymorphism behavior)
     */
    abstract protected function getStoragePath(): string;

    /**
     * Logika umum upload file
     */
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

    /**
     * Logika umum hapus file
     */
    public function delete(string $path): void
    {
        if (Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }
    }
    
    /**
     * Logika umum download
     * Mengembalikan StreamedResponse
     */
    public function getDownloadLink(string $path)
    {
        
        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk($this->disk);

        if (!$storage->exists($path)) {
             throw DocumentFailureException::fileNotFound();
        }

        return $storage->download($path);
    }
}