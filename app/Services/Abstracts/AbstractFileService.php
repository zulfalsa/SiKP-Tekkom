<?php

namespace App\Services\Abstracts;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\DocumentFailureException;

abstract class AbstractFileService
{
    /**
     * Menentukan disk (public, s3, supabase, dll)
     */
    protected function getDisk(): string
    {
        return config('filesystems.default');
    }

    /**
     * Folder penyimpanan—WAJIB di‐override oleh class turunan
     */
    abstract protected function getStoragePath(): string;

    /**
     * Upload file ke disk (Local, Public, S3, Supabase)
     */
    public function upload(UploadedFile $file): string
    {
        try {
            $path = $file->store(
                $this->getStoragePath(),
                [
                    'disk' => $this->getDisk(),
                    'visibility' => 'public',
                ]
            );

            if (!$path) {
                throw DocumentFailureException::uploadFailed($file->getClientOriginalName());
            }

            return $path;
        } catch (\Throwable $e) {
            throw DocumentFailureException::uploadFailed($file->getClientOriginalName());
        }
    }

    /**
     * Menghapus file dari storage
     */
    public function delete(string $path): void
    {
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk($this->getDisk());

        if ($disk->exists($path)) {
            $disk->delete($path);
        }
    }

    /**
     * Mendapatkan link download resmi:
     * - Local → langsung download()
     * - S3 / Supabase → Signed URL (temporaryUrl)
     */
    public function getDownloadLink(string $path, ?string $filename = null)
    {
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk($this->getDisk());

        if (!$disk->exists($path)) {
            throw DocumentFailureException::fileNotFound();
        }

        /**
         * S3 / Supabase (S3-compatible)
         * → HARUS menggunakan Signed URL, tidak bisa langsung url()
         */
        if ($this->getDisk() === 's3') {
            
            // 1. Ambil ekstensi asli dari path file yang tersimpan (misal: 'docx', 'pdf')
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            
            // 2. Tentukan nama file download. Jika user tidak input, pakai nama asli dari path.
            $downloadFilename = $filename ?? basename($path);

            // 3. Pastikan nama file diakhiri dengan ekstensi yang benar agar format terjaga.
            // Jika $downloadFilename belum punya ekstensi yang sesuai, kita tambahkan.
            if ($extension && !str_ends_with(strtolower($downloadFilename), '.' . strtolower($extension))) {
                $downloadFilename .= '.' . $extension;
            }

            // 4. Force browser untuk mengenali file sebagai attachment dengan nama & format yang benar
            $options = [
                'ResponseContentDisposition' => 'attachment; filename="' . $downloadFilename . '"',
            ];

            // Valid 5 menit
            $signedUrl = $disk->temporaryUrl(
                $path, 
                now()->addMinutes(5),
                $options
            );
            
            return redirect($signedUrl);
        }

        /**
         * Disk lokal/public → langsung download
         */
        return $disk->download($path, $filename);
    }
}