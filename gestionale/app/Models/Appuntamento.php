<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appuntamento extends Model
{
    protected $table = 'appuntamenti';

    protected $fillable = [
        'paziente_id',
        'terapista_id',
        'data',
        'ora',
        'note',
        'nome',
        'cognome',
        'durata_minuti', // Nuovo campo per la durata in minuti
    ];


    protected $casts = [
        'data' => 'date',
        'ora' => 'string', 
        'created_at' => 'datetime',
    ];


    public $timestamps = false;

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }

    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'terapista_id');
    }
}
