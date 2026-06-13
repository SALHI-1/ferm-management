<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheptelController extends Controller
{
    public function index() {
        $user = Auth::user();
        $client = $user->userable;
        
        $vaches = $client->vaches()->with('productions')->get();

        return Inertia::render('Client/CheptelList', [
            'vaches' => $vaches
        ]);
    }

    public function show($id) {
        $user = Auth::user();
        $client = $user->userable;

        // Ensure the vache belongs to the client
        $vache = $client->vaches()->with(['clients.user', 'healthStatuses', 'costs', 'productions', 'enfants'])->findOrFail($id);

        return Inertia::render('Client/CheptelDetails', [
            'vache' => $vache
        ]);
    }
}
