<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\MorphTo;

use Illuminate\Database\Eloquent\Model;

class Investissement extends Model {
    protected $fillable = ['client_id', 'vache_id', 'type_investissement', 'part_possedee', 'date_investissement'];

    public function client() { return $this->belongsTo(Client::class); }
    public function vache() { return $this->belongsTo(Vache::class); }
}