<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// ATTENTION À CETTE LIGNE : Il faut le "as AdminDashboard" pour que l'alias fonctionne !
use App\Http\Controllers\Admin\DashboardController as AdminDashboard; 
use App\Http\Controllers\Manager\DashboardController as ManagerDashboard;
use App\Http\Controllers\Client\DashboardController as ClientDashboard;


use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
// use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\InvestmentRequestController;
use App\Http\Controllers\Admin\InvestmentRequestController as AdminInvestmentRequestController;




Route::middleware('guest')->group(function () {
    Route::get('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::get('staff/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'createAdmin'])->name('admin.login');
    Route::post('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
});
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');





// 💼 Espace unique : Admins & Super-Admins
Route::prefix('admin')->middleware(['auth', 'role:admin,super_admin'])->as('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/cheptel', [\App\Http\Controllers\Admin\CheptelController::class, 'index'])->name('cheptel.index');
    Route::get('/cheptel/{id}', [\App\Http\Controllers\Admin\CheptelController::class, 'show'])->name('cheptel.show');
    Route::put('/cheptel/{id}/vente', [\App\Http\Controllers\Admin\CheptelController::class, 'updateVente'])->name('cheptel.vente.update');
    Route::post('/cheptel', [\App\Http\Controllers\Admin\CheptelController::class, 'store'])->name('cheptel.store');
    Route::post('/cheptel/{id}', [\App\Http\Controllers\Admin\CheptelController::class, 'update'])->name('cheptel.update');
    Route::post('/cheptel/{id}/financial', [\App\Http\Controllers\Admin\CheptelController::class, 'storeFinancial'])->name('cheptel.financial.store');
    Route::post('/cheptel/{id}/health', [\App\Http\Controllers\Admin\CheptelController::class, 'storeHealth'])->name('cheptel.health.store');
    Route::put('/cheptel/{id}/sante', [\App\Http\Controllers\Admin\CheptelController::class, 'updateSante'])->name('cheptel.sante.update');

    Route::get('/traceabilite', [\App\Http\Controllers\Admin\TraceabilityController::class, 'index'])->name('traceabilite.index');

    // Gestion des Clients
    Route::get('/clients', [\App\Http\Controllers\Admin\ClientController::class, 'index'])->name('clients.index');
    Route::post('/clients', [\App\Http\Controllers\Admin\ClientController::class, 'store'])->name('clients.store');
    Route::put('/clients/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{id}', [\App\Http\Controllers\Admin\ClientController::class, 'destroy'])->name('clients.destroy');

    // Gestion du Personnel (Restreint au super_admin dans le controller)
    Route::get('/staff', [\App\Http\Controllers\Admin\StaffController::class, 'index'])->name('staff.index');
    Route::post('/staff', [\App\Http\Controllers\Admin\StaffController::class, 'store'])->name('staff.store');
    Route::put('/staff/{id}', [\App\Http\Controllers\Admin\StaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{id}', [\App\Http\Controllers\Admin\StaffController::class, 'destroy'])->name('staff.destroy');

    // Gestion des Visites (Restreint au super_admin dans le controller)
    Route::get('/visites', [\App\Http\Controllers\Admin\VisiteController::class, 'index'])->name('visites.index');
    Route::put('/visites/{id}/accept', [\App\Http\Controllers\Admin\VisiteController::class, 'accept'])->name('visites.accept');
    Route::put('/visites/{id}/reject', [\App\Http\Controllers\Admin\VisiteController::class, 'reject'])->name('visites.reject');

    // Gestion des demandes d'investissement
    Route::get('/investment-requests', [AdminInvestmentRequestController::class, 'index'])->name('investment-requests.index');
    Route::patch('/investment-requests/{id}/status', [AdminInvestmentRequestController::class, 'updateStatus'])->name('investment-requests.status');
});

// 🚜 Espace unique : Managers
Route::prefix('manager')->middleware(['auth', 'role:manager'])->as('manager.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Manager\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/cheptel', [\App\Http\Controllers\Manager\CheptelController::class, 'index'])->name('cheptel.index');
    Route::get('/cheptel/{id}', [\App\Http\Controllers\Manager\CheptelController::class, 'show'])->name('cheptel.show');
    Route::put('/cheptel/{id}/vente', [\App\Http\Controllers\Manager\CheptelController::class, 'updateVente'])->name('cheptel.vente.update');
    Route::post('/cheptel', [\App\Http\Controllers\Manager\CheptelController::class, 'store'])->name('cheptel.store');
    Route::post('/cheptel/{id}', [\App\Http\Controllers\Manager\CheptelController::class, 'update'])->name('cheptel.update');
    Route::post('/cheptel/{id}/financial', [\App\Http\Controllers\Manager\CheptelController::class, 'storeFinancial'])->name('cheptel.financial.store');
    Route::post('/cheptel/{id}/health', [\App\Http\Controllers\Manager\CheptelController::class, 'storeHealth'])->name('cheptel.health.store');
    Route::put('/cheptel/{id}/sante', [\App\Http\Controllers\Manager\CheptelController::class, 'updateSante'])->name('cheptel.sante.update');
});

// 📉 Espace unique : Clients / Investisseurs
Route::middleware(['auth', 'role:client'])->prefix('investisseur')->as('client.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/bilan', [\App\Http\Controllers\Client\BilanController::class, 'index'])->name('bilan');
    
    // Cheptel pour les clients (en lecture seule)
    Route::get('/cheptel', [\App\Http\Controllers\Client\CheptelController::class, 'index'])->name('cheptel.index');
    Route::get('/cheptel/{id}', [\App\Http\Controllers\Client\CheptelController::class, 'show'])->name('cheptel.show');

    // Réservation de visites
    Route::get('/visites', [\App\Http\Controllers\Client\VisiteController::class, 'index'])->name('visites.index');
    Route::post('/visites', [\App\Http\Controllers\Client\VisiteController::class, 'store'])->name('visites.store');
});

// Demande d'investissement publique
Route::post('/investment-requests', [InvestmentRequestController::class, 'store'])->name('investment.store');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'canResetPassword' => Route::has('password.request'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();
    switch ($user->userable_type) {
        case \App\Models\Admin::class:
            return redirect()->route('admin.dashboard');
        case \App\Models\Manager::class:
            return redirect()->route('manager.dashboard');
        case \App\Models\Client::class:
            return redirect()->route('client.dashboard');
        default:
            return redirect('/');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
