<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Client;
use App\Models\Vache;

class FermeBilanController extends Controller
{
    public function index()
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user->userable_type !== \App\Models\Admin::class || $user->userable->role !== 'super_admin') {
            abort(403, 'Unauthorized action.');
        }

        $farmClient = Client::where('is_ferme', true)->first();
        
        // Cows where farm takes a commission (Cas 1)
        $cowsCommission = Vache::whereNotNull('part_ferme_net')->with(['productions', 'costs'])->get();

        // Cows where farm is direct investor (Cas 2)
        $investissements = $farmClient ? $farmClient->investissements()->with(['vache', 'vache.productions', 'vache.costs'])->get() : collect();

        $monthlyData = [];

        $processCow = function($vache, $type, $partPossedee = null) use (&$monthlyData) {
            if (!$vache) return;

            $months = [];
            foreach ($vache->productions as $prod) {
                $months[] = substr($prod->periode_mois, 0, 7); // YYYY-MM
            }
            foreach ($vache->costs as $cost) {
                $months[] = substr($cost->date_facture, 0, 7);
            }
            if ($vache->statut_vente === 'vendue' && $vache->date_vente) {
                $months[] = $vache->date_vente->format('Y-m');
            }
            
            $months = array_unique($months);

            foreach ($months as $month) {
                if (!isset($monthlyData[$month])) {
                    $monthlyData[$month] = [
                        'month' => $month,
                        'farm_costs_cas2' => 0,
                        'farm_milk_cas2' => 0,
                        'farm_sales_cas2' => 0,
                        'farm_net_cas2' => 0,
                        'farm_net_cas1' => 0,
                        'total_farm_profit' => 0
                    ];
                }

                // Costs for the month
                $costsForMonth = $vache->costs->filter(function($c) use ($month) {
                    return substr($c->date_facture, 0, 7) === $month && $c->type !== 'lait_consomme';
                });
                $totalCost = $costsForMonth->sum('price');

                // Milk for the month
                $rawMilk = $vache->productions->filter(function($p) use ($month) {
                    return substr($p->periode_mois, 0, 7) === $month;
                })->sum('quantite_litres');
                
                $consumedMilk = $vache->costs->filter(function($c) use ($month) {
                    return substr($c->date_facture, 0, 7) === $month && $c->type === 'lait_consomme';
                })->sum('price');

                $netMilk = max(0, $rawMilk - $consumedMilk);
                $milkRev = $netMilk * 4;

                // Sales for the month
                $salesRev = 0;
                if ($vache->statut_vente === 'vendue' && $vache->date_vente && $vache->date_vente->format('Y-m') === $month) {
                    $salesRev = $vache->prix_vente;
                }

                $cowNetBenefit = $milkRev + $salesRev - $totalCost;

                if ($type === 'commission') {
                    // Cas 1 : Farm just takes part of the net benefit
                    $farmShare = $cowNetBenefit * (float)$vache->part_ferme_net;
                    $monthlyData[$month]['farm_net_cas1'] += $farmShare;
                    $monthlyData[$month]['total_farm_profit'] += $farmShare;
                } else if ($type === 'investissement') {
                    // Cas 2 : Farm is an investor, so we show its part of costs and revenues
                    $farmCosts = $totalCost * $partPossedee;
                    $farmMilk = $milkRev * $partPossedee;
                    $farmSales = $salesRev * $partPossedee;
                    $farmNet = $farmMilk + $farmSales - $farmCosts;

                    $monthlyData[$month]['farm_costs_cas2'] += $farmCosts;
                    $monthlyData[$month]['farm_milk_cas2'] += $farmMilk;
                    $monthlyData[$month]['farm_sales_cas2'] += $farmSales;
                    $monthlyData[$month]['farm_net_cas2'] += $farmNet;
                    $monthlyData[$month]['total_farm_profit'] += $farmNet;
                }
            }
        };

        // Process Cas 1
        foreach ($cowsCommission as $vache) {
            $processCow($vache, 'commission');
        }

        // Process Cas 2
        foreach ($investissements as $inv) {
            $part = $inv->pivot->part_possedee ?? $inv->part_possedee;
            $processCow($inv->vache, 'investissement', $part);
        }

        // Sort descending by month
        krsort($monthlyData);
        $chartData = array_values($monthlyData);

        return \Inertia\Inertia::render('Admin/FermeBilan', [
            'bilans' => $chartData
        ]);
    }
}
