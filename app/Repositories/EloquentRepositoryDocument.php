<?php

namespace App\Repositories;

use App\Repositories\Interfaces\DocumentRepositoryInterface;
use App\Models\RepositoryDocument;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class EloquentRepositoryDocument implements DocumentRepositoryInterface
{
    public function getAllActive(): Collection
    {
        return RepositoryDocument::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Model
    {
        return RepositoryDocument::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $doc = $this->find($id);
        return $doc ? $doc->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $doc = $this->find($id);
        if ($doc) {
            return $doc->delete();
        }
        return false;
    }

    public function find(int $id): ?Model
    {
        return RepositoryDocument::find($id);
    }
}