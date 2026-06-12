<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable {
    use HasFactory, Notifiable, SoftDeletes; 

    protected $fillable = [
        'nom', 'prenom', 'email', 'telephone', 'password', 'userable_id', 'userable_type'
    ];

    protected $hidden = ['password', 'remember_token'];

    // Récupère le modèle parent (Admin, Client ou Manager)
    public function userable(): MorphTo {
        return $this->morphTo();
    }
}
