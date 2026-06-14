<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Traceability;
use Inertia\Inertia;

class TraceabilityController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $logs = Traceability::with('manager')->latest()->paginate(20);

        if ($request->wantsJson()) {
            return response()->json($logs);
        }

        return Inertia::render('Admin/Traceability', [
            'initialLogs' => $logs
        ]);
    }
}
