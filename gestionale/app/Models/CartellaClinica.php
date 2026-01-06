<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartellaClinica extends Model
{
    protected $table = 'cartelle_cliniche';

    protected $fillable = [
        'paziente_id',
        'anamnesi',
        'diagnosi',
        'terapia',
        'note',
    ];

    protected $casts = [
        'anamnesi' => 'encrypted:string',
        'diagnosi' => 'encrypted:string',
        'terapia'  => 'encrypted:string',
        'note'     => 'encrypted:string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }
}
