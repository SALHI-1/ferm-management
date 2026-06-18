<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visite;
use App\Models\Admin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class VisiteController extends Controller implements HasMiddleware
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
        $visites = Visite::with('client.user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Visites', [
            'visites' => $visites
        ]);
    }

    public function accept($id)
    {
        $visite = Visite::findOrFail($id);
        $visite->update([
            'statut' => 'acceptee',
            'motif_refus_option' => null,
            'commentaire_refus' => null,
        ]);

        return redirect()->back()->with('success', 'Visite acceptée avec succès.');
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'motif_refus_option' => 'required|string',
            'commentaire_refus' => 'nullable|string',
        ]);

        $visite = Visite::findOrFail($id);
        $visite->update([
            'statut' => 'refusee',
            'motif_refus_option' => $request->motif_refus_option,
            'commentaire_refus' => $request->commentaire_refus,
        ]);

        return redirect()->back()->with('success', 'Visite refusée.');
    }
}
