<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CheptelController extends Controller
{
    public function index() {
        return Inertia::render('Shared/CheptelList', [
            'vaches' => \App\Models\Vache::with('productions')->get(),
            'coordonneesEspace' => 'admin'
        ]);
    }

    public function show($id) {
        $vache = \App\Models\Vache::with(['clients.user', 'healthStatuses', 'costs', 'productions', 'enfants'])->findOrFail($id);
        $user = \Illuminate\Support\Facades\Auth::user();
        $canEdit = false;
        
        if ($user->userable_type === \App\Models\Admin::class && $user->userable->role === 'super_admin') {
            $canEdit = true;
        }

        return Inertia::render('Shared/CheptelDetails', [
            'vache' => $vache,
            'canEdit' => $canEdit,
            'coordonneesEspace' => 'admin'
        ]);
    }

    public function storeFinancial(Request $request, $id) {
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user->userable_type === \App\Models\Admin::class && $user->userable->role === 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'annee' => 'required|integer',
            'mois' => 'required|integer|min:1|max:12',
            'price' => 'required|numeric',
            'type' => 'required|in:food,veterinaire,autre,gain'
        ]);

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
        $user = \Illuminate\Support\Facades\Auth::user();
        if ($user->userable_type === \App\Models\Admin::class && $user->userable->role === 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'type' => 'required|in:pregnancy,sickness,checkup',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date',
        ]);

        \App\Models\HealthStatus::create([
            'vache_id' => $id,
            'type' => $request->type,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        // Mettre à jour le statut_sante de la vache si nécessaire
        if ($request->type === 'sickness' || $request->type === 'pregnancy') {
            \App\Models\Vache::where('id', $id)->update(['statut_sante' => $request->type]);
        } else if ($request->type === 'checkup') {
            // Optionnellement, on pourrait remettre à healthy, ou le laisser comme tel
        }

        return redirect()->back()->with('success', 'Données de santé ajoutées.');
    }
}
