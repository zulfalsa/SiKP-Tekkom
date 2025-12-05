<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class AnnouncementController extends Controller
{
    public function __construct(protected AnnouncementRepositoryInterface $repo) {}

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $this->repo->create([
            'title' => $request->title,
            'content' => $request->content,
            'is_active' => true,
        ]);

        return Redirect::back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $this->repo->update($id, [
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return Redirect::back();
    }

    public function destroy($id)
    {
        $this->repo->delete($id);
        return Redirect::back();
    }
}