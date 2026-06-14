<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
        $monthlyProductions = \App\Models\Production::selectRaw('periode_mois, sum(quantite_litres) as total_litres')
            ->groupBy('periode_mois')
            ->orderBy('periode_mois', 'desc')
            ->take(6)
            ->get()
            ->reverse()
            ->values();

        return \Inertia\Inertia::render('Manager/Dashboard', [
            'totalVaches' => \App\Models\Vache::count(),
            'productionDuMois' => \App\Models\Production::sum('quantite_litres'),
            'monthlyProductions' => $monthlyProductions
        ]);
    }
}
