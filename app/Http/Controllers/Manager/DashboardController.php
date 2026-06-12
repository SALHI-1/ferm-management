<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
public function index() {
    return \Inertia\Inertia::render('Manager/Dashboard', [
        'totalVaches' => \App\Models\Vache::count(),
        'productionDuMois' => \App\Models\Production::sum('quantite_litres'),
    ]);
}
}
