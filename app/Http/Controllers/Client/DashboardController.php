<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index() {
    $client = \Illuminate\Support\Facades\Auth::user()->userable;
    return \Inertia\Inertia::render('Client/Dashboard', [
        'investissements' => $client ? $client->investissements()->with('vache:id,numero_ticket,sexe')->get() : []
    ]);
}
}
