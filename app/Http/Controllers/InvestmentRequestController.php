<?php

namespace App\Http\Controllers;

use App\Models\InvestmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class InvestmentRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:investment_requests,email',
            'telephone' => 'required|string|max:255',
        ], [
            'email.unique' => 'welcome.form_email_unique',
        ]);

        InvestmentRequest::create($validated);

        return Redirect::back()->with('success', true);
    }
}
