<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FermeClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if farm already exists
        $fermeEmail = 'ferme@system.local';
        if (\App\Models\User::where('email', $fermeEmail)->exists()) {
            return;
        }

        $client = \App\Models\Client::create([
            'date_inscription' => now(),
            'is_ferme' => true,
        ]);

        $client->user()->create([
            'nom' => 'La Ferme',
            'prenom' => '',
            'email' => $fermeEmail,
            'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(24)),
        ]);
    }
}
