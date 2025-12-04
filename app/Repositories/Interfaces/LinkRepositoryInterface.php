<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface LinkRepositoryInterface
{
    public function getAll(): Collection;
    public function create(array $data): Model;
    public function delete(int $id): bool;
}