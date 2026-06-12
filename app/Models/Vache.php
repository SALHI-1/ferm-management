<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vache extends Model {
    protected $fillable = [
        'mother_id', 'sexe', 'origine','statut_vente','statut_sante','numero_ticket', 'image', 'fichier_documents', 'date_naissance', 'date_entree'
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_entree' => 'date',
    ];

    protected $appends = ['age'];

    public function getAgeAttribute() {
        return $this->date_naissance ? $this->date_naissance->age : null;
    }

    // Relation réflexive : Trouver la mère
    public function mere() {
        return $this->belongsTo(Vache::class, 'mother_id');
    }

    // Relation réflexive : Trouver les enfants (veaux/génisses)
    public function enfants() {
        return $this->hasMany(Vache::class, 'mother_id');
    }

    // Les investisseurs liés à cette vache
    public function clients() {
        return $this->belongsToMany(Client::class, 'investissements', 'vache_id', 'client_id')
                    ->withPivot('type_investissement', 'part_possedee', 'date_investissement');
    }

    // Suivis liés
    public function healthStatuses() { return $this->hasMany(HealthStatus::class); }
    public function costs() { return $this->hasMany(Cost::class); }
    public function productions() { return $this->hasMany(Production::class); }
}