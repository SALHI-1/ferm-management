<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // 1. Si l'utilisateur n'est pas connecté, retour à la case départ
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        // 2. On extrait le type réel du rôle polymorphe (Admin, Client, ou Manager)
        // userable_type contient des chaînes comme "App\Models\Admin" ou "App\Models\Claient"
        $classeRole = $user->userable_type;
        $nomRoleCourt = strtolower(class_basename($classeRole));
        // Cas particulier : Si c'est un Admin, on peut aussi checker si c'est un 'super_admin'
        if ($nomRoleCourt === 'admin' && $user->userable) {
            $roleSpecifiqueAdmin = $user->userable->role; // 'admin' ou 'super_admin'
            if (in_array($roleSpecifiqueAdmin, $roles)) {
                return $next($request);
            }
        }

        // 3. Vérification standard si le rôle correspond à ceux autorisés dans la route
        if (in_array($nomRoleCourt, $roles)) {
            return $next($request);
        }

        // 4. Si l'utilisateur n'a pas le bon rôle, on le bloque ou on le redirige gentiment
        return abort(403, "Vous n'avez pas l'autorisation d'accéder à cette page.");
    }
}