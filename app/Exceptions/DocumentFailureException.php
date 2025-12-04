<?php

namespace App\Exceptions;

use Exception;

class DocumentFailureException extends Exception
{
    public static function uploadFailed(string $filename): self
    {
        return new self("Gagal mengunggah dokumen: {$filename}. Silakan coba lagi.");
    }

    public static function fileNotFound(): self
    {
        return new self("File fisik tidak ditemukan di penyimpanan.");
    }
}