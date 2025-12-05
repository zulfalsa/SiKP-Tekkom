<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\LinkRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LinkController extends Controller
{
    public function __construct(protected LinkRepositoryInterface $repo) {}

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $this->repo->create($request->all());

        return Redirect::back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $this->repo->update($id, $request->all());

        return Redirect::back();
    }

    public function destroy($id)
    {
        $this->repo->delete($id);
        return Redirect::back();
    }
}