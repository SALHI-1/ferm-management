<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\MorphTo;

use Illuminate\Database\Eloquent\Model;



class Client extends Model {
    protected $fillable = ['date_inscription'];

    public function user() {
        return $this->morphOne(User::class, 'userable');
    }

    // Un client possède plusieurs investissements
    public function investissements() {
        return $this->hasMany(Investissement::class);
    }

    // Accéder directement aux vaches associées via la table pivot
    public function vaches() {
        return $this->belongsToMany(Vache::class, 'investissements', 'client_id', 'vache_id')
                    ->withPivot('type_investissement', 'part_possedee', 'date_investissement')
                    ->withTimestamps();
    }
}