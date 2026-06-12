<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\MorphTo;

use Illuminate\Database\Eloquent\Model;

class HealthStatus extends Model {
    protected $fillable = ['vache_id', 'type', 'date_debut', 'date_fin'];
    public function vache() { return $this->belongsTo(Vache::class); }
}