<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Traceability extends Model
{
    protected $fillable = ['manager_id', 'action_type', 'model_type', 'model_id', 'description'];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
