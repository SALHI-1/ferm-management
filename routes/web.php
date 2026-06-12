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




Route::middleware('guest')->group(function () {
    Route::get('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::get('staff/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'createAdmin'])->name('admin.login');
    Route::post('login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
});
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout')->middleware('auth');





// 💼 Espace unique : Admins & Super-Admins
Route::middleware(['auth', 'role:admin,super_admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/cheptel', [\App\Http\Controllers\Admin\CheptelController::class, 'index'])->name('cheptel.index');
    Route::get('/cheptel/{id}', [\App\Http\Controllers\Admin\CheptelController::class, 'show'])->name('cheptel.show');
    Route::post('/cheptel/{id}/financial', [\App\Http\Controllers\Admin\CheptelController::class, 'storeFinancial'])->name('cheptel.financial.store');
    Route::post('/cheptel/{id}/health', [\App\Http\Controllers\Admin\CheptelController::class, 'storeHealth'])->name('cheptel.health.store');
});

// 🚜 Espace unique : Managers
Route::middleware(['auth', 'role:manager'])->prefix('manager')->as('manager.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Manager\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/cheptel', [\App\Http\Controllers\Manager\CheptelController::class, 'index'])->name('cheptel.index');
    Route::get('/cheptel/{id}', [\App\Http\Controllers\Manager\CheptelController::class, 'show'])->name('cheptel.show');
    Route::post('/cheptel/{id}/financial', [\App\Http\Controllers\Manager\CheptelController::class, 'storeFinancial'])->name('cheptel.financial.store');
    Route::post('/cheptel/{id}/health', [\App\Http\Controllers\Manager\CheptelController::class, 'storeHealth'])->name('cheptel.health.store');
});

// 📉 Espace unique : Clients / Investisseurs
Route::middleware(['auth', 'role:client'])->prefix('investisseur')->as('client.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Client\DashboardController::class, 'index'])->name('dashboard');
});


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
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
