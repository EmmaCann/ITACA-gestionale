<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagamento extends Model
{
    protected $table = 'pagamenti';

    protected $fillable = [
        'paziente_id',
        'terapista_id',
        'data',
        'importo',
        'nome',
        'cognome',
        'fattura',
    ];

    protected $casts = [
        'data' => 'date',
        'importo' => 'decimal:2',
        'created_at' => 'datetime',
        'fattura' => 'boolean',
    ];


    public $timestamps = false;

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }

    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'terapista_id')->with('staffDati');
    }
}
