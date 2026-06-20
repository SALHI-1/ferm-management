<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestmentRequest extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'status',
    ];
}
