<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Admin;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StaffController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(function ($request, $next) {
                $user = auth()->user();
                if ($user->userable_type !== Admin::class || $user->userable->role !== 'super_admin') {
                    abort(403, 'Accès réservé aux Super Admins.');
                }
                return $next($request);
            }),
        ];
    }

    public function index()
    {
        $staff = User::whereIn('userable_type', [Admin::class, Manager::class])
            ->with('userable')
            ->latest()
            ->get();

        return Inertia::render('Admin/Staff/Index', [
            'staff' => $staff
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'telephone' => 'nullable|string|max:20',
            'type' => 'required|in:admin,super_admin,manager',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $userable = null;

        if ($request->type === 'manager') {
            $userable = Manager::create([]);
        } else {
            $userable = Admin::create(['role' => $request->type]);
        }

        User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'userable_id' => $userable->id,
            'userable_type' => get_class($userable)
        ]);

        return redirect()->back()->with('success', 'Membre du personnel ajouté.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'type' => 'required|in:admin,super_admin,manager',
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

        // Mise à jour du type/role
        if ($user->userable_type === Admin::class && in_array($request->type, ['admin', 'super_admin'])) {
            $user->userable->update(['role' => $request->type]);
        }
        
        return redirect()->back()->with('success', 'Membre du personnel mis à jour.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Empêcher le super_admin de se supprimer lui-même
        if (auth()->id() === $user->id) {
            abort(403, 'Vous ne pouvez pas vous archiver vous-même.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur archivé avec succès.');
    }
}
