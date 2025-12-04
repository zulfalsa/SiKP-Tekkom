<?php

namespace App\Repositories;

use App\Repositories\Interfaces\LinkRepositoryInterface;
use App\Models\ExternalLink;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class EloquentLinkRepository implements LinkRepositoryInterface
{
    public function getAll(): Collection
    {
        return ExternalLink::orderBy('created_at', 'desc')->get();
    }

    public function create(array $data): Model
    {
        return ExternalLink::create($data);
    }

    public function delete(int $id): bool
    {
        $record = ExternalLink::find($id);
        return $record ? $record->delete() : false;
    }
}