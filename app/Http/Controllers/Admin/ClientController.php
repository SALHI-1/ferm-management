<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        // On récupère les users qui sont des clients, non soft-deleted
        $clients = User::where('userable_type', Client::class)->with('userable')->latest()->get();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'telephone' => 'nullable|string|max:20',
            'date_inscription' => 'required|date',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $client = Client::create([
            'date_inscription' => $request->date_inscription
        ]);

        User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'userable_id' => $client->id,
            'userable_type' => Client::class
        ]);

        return redirect()->back()->with('success', 'Client créé avec succès.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->userable_type !== Client::class) {
            abort(403);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $data = [
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'Client mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->userable_type !== Client::class) {
            abort(403);
        }

        // Soft delete (Laravel gérera l'archivage car User a le trait SoftDeletes)
        $user->delete();

        return redirect()->back()->with('success', 'Client archivé avec succès.');
    }
}
