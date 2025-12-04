<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Services\RepositoryDocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Exceptions\DocumentFailureException;

class DocumentController extends Controller
{
    protected $repository;
    protected $fileService;

    // Dependency Injection Interface & Abstract implementation
    public function __construct(
        DocumentRepositoryInterface $repository,
        RepositoryDocumentService $fileService
    ) {
        $this->repository = $repository;
        $this->fileService = $fileService;
    }

    public function index()
    {
        // Mengambil semua dokumen untuk ditampilkan di Dashboard Admin
        $documents = $this->repository->getAllActive();
        return Inertia::render('admin/documents/index', [
            'documents' => $documents
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:5120', // Max 5MB
        ]);

        DB::beginTransaction();
        try {
            // Upload file menggunakan Service (OOP)
            $filePath = $this->fileService->upload($request->file('file'));

            // Simpan data ke database via Repository
            $this->repository->create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $filePath,
                'is_active' => true,
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');

        } catch (DocumentFailureException $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['file' => $e->getMessage()]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['file' => 'Terjadi kesalahan sistem.']);
        }
    }

    public function destroy($id)
    {
        $document = $this->repository->find($id);

        if ($document) {
            // Hapus file fisik menggunakan Service
            $this->fileService->delete($document->file_path);
            // Hapus data database
            $this->repository->delete($id);
            
            return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
        }

        return redirect()->back()->withErrors(['error' => 'Dokumen tidak ditemukan.']);
    }
}