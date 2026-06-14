<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
        $client = \Illuminate\Support\Facades\Auth::user()->userable;
        $investissements = $client ? $client->investissements()->with(['vache:id,numero_ticket,sexe', 'vache.productions', 'vache.costs'])->get() : collect();

        // Calculate chart data
        $monthlyData = [];

        foreach ($investissements as $inv) {
            $part = $inv->pivot->part_possedee ?? $inv->part_possedee; // ensure we get pivot correctly if needed
            $vache = $inv->vache;
            if (!$vache) continue;

            // Productions (Benefits)
            foreach ($vache->productions as $prod) {
                $month = date('Y-m', strtotime($prod->periode_mois));
                if (!isset($monthlyData[$month])) {
                    $monthlyData[$month] = ['name' => $month, 'benefits' => 0, 'food_costs' => 0, 'health_costs' => 0];
                }
                $monthlyData[$month]['benefits'] += $prod->quantite_litres * $part;
            }

            // Costs
            foreach ($vache->costs as $cost) {
                $month = date('Y-m', strtotime($cost->date_facture));
                if (!isset($monthlyData[$month])) {
                    $monthlyData[$month] = ['name' => $month, 'benefits' => 0, 'food_costs' => 0, 'health_costs' => 0];
                }
                
                if ($cost->type === 'food') {
                    $monthlyData[$month]['food_costs'] += $cost->price * $part;
                } else if ($cost->type === 'veterinaire') {
                    $monthlyData[$month]['health_costs'] += $cost->price * $part;
                }
            }
        }

        ksort($monthlyData);
        $chartData = array_values($monthlyData);

        return \Inertia\Inertia::render('Client/Dashboard', [
            'investissements' => $client ? $client->investissements()->with('vache:id,numero_ticket,sexe')->get() : [],
            'financialChartData' => $chartData
        ]);
    }
}
