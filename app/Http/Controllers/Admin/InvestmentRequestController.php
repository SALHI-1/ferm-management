<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvestmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class InvestmentRequestController extends Controller
{
    public function index()
    {
        $requests = InvestmentRequest::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/InvestmentRequests', [
            'requests' => $requests
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:en attente,confirmé,refusé,annulé',
        ]);

        $investmentRequest = InvestmentRequest::findOrFail($id);
        $investmentRequest->update($validated);

        return Redirect::back()->with('success', 'Statut de la demande mis à jour avec succès.');
    }
}
