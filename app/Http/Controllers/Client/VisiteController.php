<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Visite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VisiteController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Fetch visites for the logged-in client
        $visites = Visite::where('client_id', $user->userable_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Client/Visites', [
            'visites' => $visites
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date_visite' => 'required|date|after_or_equal:today',
            'heure_visite' => 'required',
        ]);

        $user = Auth::user();

        Visite::create([
            'client_id' => $user->userable_id,
            'date_visite' => $request->date_visite,
            'heure_visite' => $request->heure_visite,
            'statut' => 'en_attente',
        ]);

        return redirect()->back()->with('success', 'Votre demande de visite a été enregistrée avec succès.');
    }
}
