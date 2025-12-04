<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface DocumentRepositoryInterface
{
    public function getAllActive(): Collection;
    public function create(array $data): Model;
    public function delete(int $id): bool;
    public function find(int $id): ?Model;
}