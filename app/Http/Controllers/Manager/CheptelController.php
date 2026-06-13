<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CheptelController extends Controller
{
    public function index() {
        return Inertia::render('Shared/CheptelList', [
            'vaches' => \App\Models\Vache::with('productions')->get(),
            'canEdit' => true,
            'coordonneesEspace' => 'manager',
            'clientsDisponibles' => \App\Models\Client::with('user')->get(),
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'numero_ticket' => 'required|string|unique:vaches',
            'sexe' => 'required|in:male,female',
            'origine' => 'required|in:achete,ne_sur_ferme',
            'date_naissance' => 'required|date',
            'date_entree' => 'required|date',
            'mother_id' => 'nullable|exists:vaches,id',
            'type_investissement' => 'required_without:mother_id|in:complet,demi',
            'client_1_id' => 'required_if:type_investissement,complet,demi|nullable|exists:clients,id',
            'client_2_id' => 'required_if:type_investissement,demi|nullable|exists:clients,id|different:client_1_id',
        ]);

        if ($request->mother_id) {
            $mother = \App\Models\Vache::with('clients')->find($request->mother_id);
            if ($mother && $mother->statut_vente === 'vendue') {
                abort(403, 'Impossible d\'ajouter une descendance à une vache vendue.');
            }
        }

        $vache = \App\Models\Vache::create([
            'numero_ticket' => $request->numero_ticket,
            'sexe' => $request->sexe,
            'origine' => $request->origine,
            'date_naissance' => $request->date_naissance,
            'date_entree' => $request->date_entree,
            'mother_id' => $request->mother_id,
            'statut_vente' => 'non_vendue',
            'statut_sante' => 'healthy'
        ]);

        if ($request->mother_id) {
            if (isset($mother) && $mother) {
                foreach ($mother->clients as $client) {
                    $vache->clients()->attach($client->id, [
                        'type_investissement' => $client->pivot->type_investissement,
                        'part_possedee' => $client->pivot->part_possedee,
                        'date_investissement' => $request->date_entree,
                    ]);
                }
            }
        } else {
            if ($request->type_investissement === 'complet' && $request->client_1_id) {
                $vache->clients()->attach($request->client_1_id, [
                    'type_investissement' => 'complet',
                    'part_possedee' => 1.0,
                    'date_investissement' => $request->date_entree,
                ]);
            } elseif ($request->type_investissement === 'demi' && $request->client_1_id && $request->client_2_id) {
                $vache->clients()->attach($request->client_1_id, [
                    'type_investissement' => 'demi',
                    'part_possedee' => 0.5,
                    'date_investissement' => $request->date_entree,
                ]);
                $vache->clients()->attach($request->client_2_id, [
                    'type_investissement' => 'demi',
                    'part_possedee' => 0.5,
                    'date_investissement' => $request->date_entree,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Animal ajouté au cheptel avec succès.');
    }

    public function show($id) {
        $vache = \App\Models\Vache::with(['clients.user', 'healthStatuses', 'costs', 'productions', 'enfants'])->findOrFail($id);
        
        return Inertia::render('Shared/CheptelDetails', [
            'vache' => $vache,
            'canEdit' => true, // Managers can always edit
            'coordonneesEspace' => 'manager'
        ]);
    }

    public function updateVente(Request $request, $id) {
        $vache = \App\Models\Vache::findOrFail($id);
        $request->validate([
            'statut_vente' => 'required|in:vendue,non_vendue'
        ]);

        $vache->update(['statut_vente' => $request->statut_vente]);

        return redirect()->back()->with('success', 'Statut de vente mis à jour avec succès.');
    }

    public function storeFinancial(Request $request, $id) {
        $vache = \App\Models\Vache::findOrFail($id);
        if ($vache->statut_vente === 'vendue') {
            abort(403, 'Impossible d\'ajouter des données financières à une vache vendue.');
        }

        $request->validate([
            'annee' => 'required|integer',
            'mois' => 'required|integer|min:1|max:12',
            'price' => 'required|numeric',
            'type' => 'required|in:food,veterinaire,autre,gain'
        ]);

        if ($request->type === 'gain' && $vache->sexe === 'male') {
            abort(403, 'Un mâle ne peut pas avoir de production de lait.');
        }

        $date = $request->annee . '-' . str_pad($request->mois, 2, '0', STR_PAD_LEFT) . '-01';

        if ($request->type === 'gain') {
            \App\Models\Production::create([
                'vache_id' => $id,
                'quantite_litres' => $request->price,
                'periode_mois' => $date
            ]);
        } else {
            \App\Models\Cost::create([
                'vache_id' => $id,
                'type' => $request->type,
                'price' => $request->price,
                'date_facture' => $date
            ]);
        }

        return redirect()->back()->with('success', 'Données financières ajoutées.');
    }

    public function storeHealth(Request $request, $id) {
        $vache = \App\Models\Vache::findOrFail($id);
        if ($vache->statut_vente === 'vendue') {
            abort(403, 'Impossible d\'ajouter des données de santé à une vache vendue.');
        }

        $request->validate([
            'type' => 'required|in:pregnancy,sickness,checkup',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date',
        ]);

        if ($request->type === 'pregnancy' && $vache->sexe === 'male') {
            abort(403, 'Un mâle ne peut pas être en gestation.');
        }

        \App\Models\HealthStatus::create([
            'vache_id' => $id,
            'type' => $request->type,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        if ($request->type === 'sickness' || $request->type === 'pregnancy') {
            $vache->update(['statut_sante' => $request->type]);
        }

        return redirect()->back()->with('success', 'Données de santé ajoutées.');
    }
}
