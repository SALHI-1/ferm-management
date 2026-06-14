<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vache;
use App\Models\Cost;
use App\Models\Production;
use Carbon\Carbon;

class HistorySeeder extends Seeder
{
    public function run()
    {
        $vaches = Vache::whereHas('clients')->get();

        foreach ($vaches as $vache) {
            for ($i = 6; $i >= 0; $i--) {
                $month = Carbon::now()->subMonths($i)->format('Y-m-01');
                
                // Add food cost
                Cost::create([
                    'vache_id' => $vache->id,
                    'type' => 'food',
                    'price' => rand(300, 600),
                    'date_facture' => $month
                ]);

                // Add health cost randomly
                if (rand(1, 3) == 1) {
                    Cost::create([
                        'vache_id' => $vache->id,
                        'type' => 'veterinaire',
                        'price' => rand(100, 300),
                        'date_facture' => $month
                    ]);
                }

                // Add production if female
                if ($vache->sexe == 'female') {
                    Production::create([
                        'vache_id' => $vache->id,
                        'quantite_litres' => rand(400, 800),
                        'periode_mois' => $month
                    ]);
                }
            }
        }
    }
}
