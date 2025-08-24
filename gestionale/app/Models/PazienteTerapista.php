<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Utente;

class PazienteTerapista extends Model
{
    use HasFactory;

    protected $table = 'pazienti_terapisti';

    protected $fillable = [
        'paziente_id',
        'terapista_id',
        'data',
    ];

    // Relazioni verso User
    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }

    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'terapista_id');
    }
}
