<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BilanController extends Controller
{
    public function index() {
        $client = \Illuminate\Support\Facades\Auth::user()->userable;
        $investissements = $client ? $client->investissements()->with(['vache', 'vache.productions', 'vache.costs'])->get() : collect();

        $yearlyData = [];
        $currentYear = (int)date('Y');

        foreach ($investissements as $inv) {
            $part = $inv->pivot->part_possedee ?? $inv->part_possedee;
            $vache = $inv->vache;
            if (!$vache) continue;

            $years = [];
            foreach ($vache->productions as $prod) {
                $years[] = date('Y', strtotime($prod->periode_mois));
            }
            foreach ($vache->costs as $cost) {
                $years[] = date('Y', strtotime($cost->date_facture));
            }
            if ($vache->statut_vente === 'vendue' && $vache->date_vente) {
                $years[] = $vache->date_vente->format('Y');
            }
            
            $years = array_unique($years);

            foreach ($years as $year) {
                $yearInt = (int)$year;
                if ($yearInt >= $currentYear) {
                    continue; // Exclude current and future years
                }

                if (!isset($yearlyData[$year])) {
                    $yearlyData[$year] = [
                        'year' => $year,
                        'total_costs' => 0,
                        'net_milk_revenue' => 0,
                        'sales_revenue' => 0,
                        'net_benefit' => 0,
                        'farm_part' => 0,
                        'client_part' => 0,
                        'has_error' => false
                    ];
                }

                // Costs
                $costsForYear = $vache->costs->filter(function($c) use ($year) {
                    return substr($c->date_facture, 0, 4) === $year && $c->type !== 'lait_consomme';
                });
                $totalCost = $costsForYear->sum('price');

                // Milk
                $rawMilk = $vache->productions->filter(function($p) use ($year) {
                    return substr($p->periode_mois, 0, 4) === $year;
                })->sum('quantite_litres');
                
                $consumedMilk = $vache->costs->filter(function($c) use ($year) {
                    return substr($c->date_facture, 0, 4) === $year && $c->type === 'lait_consomme';
                })->sum('price');

                $netMilk = max(0, $rawMilk - $consumedMilk);
                $milkRev = $netMilk * 4;

                // Sales
                $salesRev = 0;
                if ($vache->statut_vente === 'vendue' && $vache->date_vente && $vache->date_vente->format('Y') === $year) {
                    $salesRev = $vache->prix_vente;
                }

                $cowNetBenefit = $milkRev + $salesRev - $totalCost;
                
                // Add totals (Note: we store global totals across all cows)
                // But for client part, we calculate per cow first
                $yearlyData[$year]['total_costs'] += $totalCost;
                $yearlyData[$year]['net_milk_revenue'] += $milkRev;
                $yearlyData[$year]['sales_revenue'] += $salesRev;
                $yearlyData[$year]['net_benefit'] += $cowNetBenefit;

                if ($cowNetBenefit < 0) {
                    $yearlyData[$year]['has_error'] = true;
                }

                $farmCut = $cowNetBenefit * 0.5; // Farm takes 50%
                $remaining = $cowNetBenefit - $farmCut; // 50% remaining
                $clientShare = $remaining * $part; // Client takes their part of the remaining
                $farmShare = $farmCut + ($remaining - $clientShare); // Farm keeps the rest

                $yearlyData[$year]['farm_part'] += $farmShare;
                $yearlyData[$year]['client_part'] += $clientShare;
            }
        }

        // Descending sort for years:
        krsort($yearlyData);
        $chartData = array_values($yearlyData);

        return \Inertia\Inertia::render('Client/BilanAnnuel', [
            'bilans' => $chartData
        ]);
    }
}
