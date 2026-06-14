<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Welcome', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function createAdmin(): Response
    {
        // Nouvelle vue dédiée pour l'administration/staff
        return Inertia::render('Auth/AdminLogin');
    }

    /**
     * Handle an incoming authentication request.
     */
public function store(LoginRequest $request): RedirectResponse
{
    // 1. On tente la connexion globale (vérification email + password)
    $request->authenticate();
    $request->session()->regenerate();

    $user = Auth::user();
    
    // 2. On récupère la page d'où vient l'utilisateur (l'URL précédente)
    $provenance = url()->previous();

    // 🔒 CAS A : L'utilisateur tente de se connecter via le portail STAFF (/staff/login)
    if (str_contains($provenance, 'staff/login')) {
        // Si ce n'est NI un Admin NI un Manager, on lui refuse l'accès au Staff !
        if ($user->userable_type !== \App\Models\Admin::class && $user->userable_type !== \App\Models\Manager::class) {
            Auth::logout();
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Ce portail est strictement réservé à l’administration de la ferme.',
            ]);
        }
    }

    // 🔒 CAS B : L'utilisateur tente de se connecter via le portail CLIENTS (/login)
    if (!str_contains($provenance, 'staff/login')) {
        // Si c'est un Admin ou un Manager qui essaie de passer par le portail client, on le bloque
        if ($user->userable_type === \App\Models\Admin::class || $user->userable_type === \App\Models\Manager::class) {
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Les membres du personnel doivent se connecter via le portail Staff.',
            ]);
        }
    }

switch ($user->userable_type) {
    case \App\Models\Admin::class:
        return redirect()->intended(route('admin.dashboard')); // Redirige vers /admin/dashboard

    case \App\Models\Manager::class:
        return redirect()->intended(route('manager.dashboard')); // Redirige vers /manager/dashboard

    case \App\Models\Client::class:
        return redirect()->intended(route('client.dashboard')); // Redirige vers /investisseur/dashboard

    default:
        return redirect('/');
}
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $userType = Auth::user()?->userable_type;

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($userType === \App\Models\Admin::class || $userType === \App\Models\Manager::class) {
            return redirect()->route('admin.login');
        }

        return redirect('/');
    }
}
