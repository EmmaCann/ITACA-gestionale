<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tariffa extends Model
{
    protected $table = 'tariffe';

    protected $fillable = [
        'utente_id',
        'terapia',
        'prezzo',
        'durata',
    ];

    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'utente_id');
    }
}
