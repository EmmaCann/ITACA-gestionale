<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Firma extends Model
{
    protected $table = 'firme';
    protected $fillable = ['paziente_id','nome', 'cognome', 'data', 'terapia', 'terapista_id'];

    protected $casts = [
        'data' => 'date',
    ];


    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'terapista_id');
    }

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }
}
