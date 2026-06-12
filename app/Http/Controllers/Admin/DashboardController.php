<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
    return \Inertia\Inertia::render('Admin/Dashboard', [
        'stats' => [
            'total_users' => \App\Models\User::count(),
        ],
        'users' => \App\Models\User::select('id', 'nom', 'prenom', 'email', 'userable_type')->get()
    ]);
}
}
