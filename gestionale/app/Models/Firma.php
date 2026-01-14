<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Firma extends Model
{
    protected $table = 'firme';
    protected $fillable = ['paziente_id', 'nome', 'cognome', 'data', 'terapia', 'note', 'terapista_id'];

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

    /* ================= NUOVO (MULTI) ================= */

    public function terapisti()
    {
        return $this->belongsToMany(
            Utente::class,
            'firma_terapista',
            'firma_id',
            'terapista_id'
        );
    }

    public function terapie()
    {
        return $this->hasMany(\App\Models\FirmaTerapia::class);
    }

    /* ================= FALLBACK (LEGACY SAFE) ================= */

    public function getTerapistiEffettivi()
    {
        return $this->terapisti->isNotEmpty()
            ? $this->terapisti
            : ($this->terapista ? collect([$this->terapista]) : collect());
    }

    public function getTerapieEffettive()
    {
        return $this->terapie->isNotEmpty()
            ? $this->terapie->pluck('terapia')
            : collect([$this->terapia])->filter();
    }
}
