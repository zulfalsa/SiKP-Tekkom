<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\LinkRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LinkController extends Controller
{
    protected $repo;

    public function __construct(LinkRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $this->repo->create($request->all());

        return Redirect::back();
    }

    public function destroy($id)
    {
        $this->repo->delete($id);
        return Redirect::back();
    }
}