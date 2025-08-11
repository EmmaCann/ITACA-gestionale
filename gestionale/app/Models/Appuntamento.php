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
    ];
    

    protected $casts = [
        'data' => 'date',
        'ora' => 'datetime:H:i:s',
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
