<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Admin;
use App\Models\Client;
use App\Models\Manager;
use App\Models\Vache;
use App\Models\Investissement;
use App\Models\HealthStatus;
use App\Models\Cost;
use App\Models\Production;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. CRÉATION DU SUPER ADMIN
        $superAdminRole = Admin::create([
            'role' => 'super_admin'
        ]);

        User::create([
            'nom' => 'Salhi',
            'prenom' => 'Mohammed',
            'email' => 'admin@ferm.com',
            'telephone' => '+212600000000',
            'password' => Hash::make('password'), // Ton mot de passe de test
            'userable_id' => $superAdminRole->id,
            'userable_type' => Admin::class,
        ]);

        // 1.5 CRÉATION DU MANAGER
        $managerRole = Manager::create([]);

        User::create([
            'nom' => 'Manager',
            'prenom' => 'Test',
            'email' => 'manager@ferm.com',
            'telephone' => '+212622222222',
            'password' => Hash::make('password'),
            'userable_id' => $managerRole->id,
            'userable_type' => Manager::class,
        ]);

        // 2. CRÉATION DE QUELQUES CLIENTS (INVESTISSEURS)
        $clients = [];
        for ($i = 1; $i <= 5; $i++) {
            $clientRole = Client::create([
                'date_inscription' => Carbon::now()->subMonths(rand(1, 12))
            ]);

            $user = User::create([
                'nom' => "NomClient$i",
                'prenom' => "PrenomClient$i",
                'email' => "client$i@ferm.com",
                'telephone' => '+21261111111' . $i,
                'password' => Hash::make('password'),
                'userable_id' => $clientRole->id,
                'userable_type' => Client::class,
            ]);

            $clients[] = $clientRole;
        }

        // 3. CRÉATION DU CHEPTEL (VACHES)
        // On crée d'abord des mères (sans mother_id)
        $meres = [];
        for ($i = 1; $i <= 5; $i++) {
            $meres[] = Vache::create([
                'mother_id' => null,
                'sexe' => 'female',
                'origine' => 'achete',
                'statut_vente' => 'non_vendue',
                'statut_sante' => collect(['healthy', 'pregnancy', 'sickness'])->random(),
                'numero_ticket' => "TK-MERE-10" . $i,
                'date_naissance' => Carbon::now()->subYears(rand(5, 8)),
                'date_entree' => Carbon::now()->subYears(rand(3, 5)),
            ]);
        }

        // On crée des enfants (veaux/génisses) rattachés aux mères
        $cheptelComplet = [...$meres];
        foreach ($meres as $key => $mere) {
            // Un mâle né sur la ferme
            $cheptelComplet[] = Vache::create([
                'mother_id' => $mere->id,
                'sexe' => 'male',
                'origine' => 'ne_sur_ferme',
                'statut_vente' => 'non_vendue',
                'statut_sante' => collect(['healthy', 'sickness'])->random(),
                'numero_ticket' => "TK-VEAU-20" . $key,
                'date_naissance' => Carbon::now()->subMonths(rand(11, 12)),
                'date_entree' => Carbon::now()->subMonths(rand(1, 10)),
            ]);

            // Une femelle née sur la ferme
            $cheptelComplet[] = Vache::create([
                'mother_id' => $mere->id,
                'sexe' => 'female',
                'origine' => 'ne_sur_ferme',
                'statut_vente' => 'non_vendue',
                'statut_sante' => collect(['healthy', 'pregnancy', 'sickness'])->random(),
                'numero_ticket' => "TK-GENISSE-30" . $key,
                'date_naissance' => Carbon::now()->subMonths(rand(12, 14)),
                'date_entree' => Carbon::now()->subMonths(rand(1, 11)),
            ]);
        }

        // 4. GENERATION DES INVESTISSEMENTS (Pivot)
        foreach ($clients as $client) {
            // Chaque investisseur prend des parts dans 2 vaches au hasard
            $vachesDisponibles = collect($cheptelComplet)->random(2);
            
            foreach ($vachesDisponibles as $vache) {
                $type = rand(0, 1) == 0 ? 'demi' : 'complet';
                    Investissement::create([
                        'client_id' => $client->id,
                        'vache_id' => $vache->id,
                        'type_investissement' => $type, // <--- Corrigé en français (avec un 'e')
                        'part_possedee' => $type === 'complet' ? 1.0 : 0.5,
                        'date_investissement' => Carbon::now()->subDays(rand(5, 60)),
                    ]);
            }
        }

        // 5. SUIVI QUOTIDIEN (Santé, Coûts, Production)
        foreach ($cheptelComplet as $vache) {
            // Ajout d'un statut sanitaire aléatoire
            HealthStatus::create([
                'vache_id' => $vache->id,
                'type' => collect(['pregnancy', 'sickness'])->random(),
                'date_debut' => Carbon::now()->subDays(15),
                'date_fin' => rand(0, 1) == 0 ? Carbon::now()->subDays(2) : null,
            ]);

            // Ajout de quelques charges/coûts
            Cost::create([
                'vache_id' => $vache->id,
                'type' => 'food',
                'price' => rand(150, 500),
                'date_facture' => Carbon::now()->subDays(rand(1, 20)),
            ]);
            Cost::create([
                'vache_id' => $vache->id,
                'type' => 'veterinaire',
                'price' => rand(200, 1000),
                'date_facture' => Carbon::now()->subDays(rand(1, 20)),
            ]);

            // Production de lait UNIQUE POUR LES FEMELLES
            if ($vache->sexe === 'female') {
                Production::create([
                    'vache_id' => $vache->id,
                    'quantite_litres' => rand(150, 400),
                    'periode_mois' => Carbon::now()->startOfMonth(),
                ]);
            }
        }
    }
}