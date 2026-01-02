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
        'durata_minuti',
        'is_group',
        'titolo',
    ];


    protected $casts = [
        'data' => 'date',
        'ora' => 'string',
        'created_at' => 'datetime',
        'is_group' => 'boolean',
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

    public function pazienti()
    {
        return $this->belongsToMany(Utente::class, 'appuntamento_paziente', 'appuntamento_id', 'paziente_id');
    }

    public function terapisti()
    {
        return $this->belongsToMany(Utente::class, 'appuntamento_terapista', 'appuntamento_id', 'terapista_id');
    }
}
