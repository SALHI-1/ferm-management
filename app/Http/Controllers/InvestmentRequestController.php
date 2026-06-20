<?php

namespace App\Http\Controllers;

use App\Models\InvestmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class InvestmentRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'required|string|max:255',
        ]);

        InvestmentRequest::create($validated);

        return Redirect::back()->with('success', "Votre demande a bien été prise en compte et est en attente de validation (nous allons vous contacter le plus tôt possible).");
    }
}
