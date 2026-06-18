<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visite extends Model
{
    protected $fillable = [
        'client_id',
        'date_visite',
        'heure_visite',
        'statut',
        'motif_refus_option',
        'commentaire_refus',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
