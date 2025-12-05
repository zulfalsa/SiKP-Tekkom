<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Services\RepositoryDocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use App\Exceptions\DocumentFailureException;

class DocumentController extends Controller
{
    public function __construct(
        protected DocumentRepositoryInterface $repository,
        protected RepositoryDocumentService $fileService
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        DB::beginTransaction();
        try {
            $filePath = $this->fileService->upload($request->file('file'));

            $this->repository->create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $filePath,
                'is_active' => true,
            ]);

            DB::commit();
            return Redirect::back()->with('success', 'Dokumen berhasil diunggah.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->withErrors(['file' => 'Gagal mengunggah dokumen.']);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
        ]);

        $document = $this->repository->find($id);
        if (!$document) return Redirect::back()->withErrors(['error' => 'Dokumen tidak ditemukan.']);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        DB::beginTransaction();
        try {
            // Jika ada file baru, hapus lama & upload baru
            if ($request->hasFile('file')) {
                $this->fileService->delete($document->file_path);
                $data['file_path'] = $this->fileService->upload($request->file('file'));
            }

            $this->repository->update($id, $data);

            DB::commit();
            return Redirect::back()->with('success', 'Dokumen diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->withErrors(['file' => 'Gagal memperbarui dokumen.']);
        }
    }

    public function destroy($id)
    {
        $document = $this->repository->find($id);
        if ($document) {
            $this->fileService->delete($document->file_path);
            $this->repository->delete($id);
        }
        return Redirect::back();
    }
}