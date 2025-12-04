<?php

namespace App\Repositories;

use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class EloquentAnnouncementRepository implements AnnouncementRepositoryInterface
{
    public function getAllActive(): Collection
    {
        return Announcement::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data): Model
    {
        return Announcement::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $record = Announcement::find($id);
        return $record ? $record->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $record = Announcement::find($id);
        return $record ? $record->delete() : false;
    }

    public function find(int $id): ?Model
    {
        return Announcement::find($id);
    }
}