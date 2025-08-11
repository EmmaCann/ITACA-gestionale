<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListaAttesa extends Model
{
    protected $table = 'lista_attesa';

    protected $fillable = [
        'nome',
        'cognome',
        'telefono',
        'email',
        'data',
        'terapia',
        'terapista_id',
        'chiamato',
        'utente_id',
    ];

    protected $casts = [
        'data' => 'date',
        'chiamato' => 'boolean',
        'created_at' => 'datetime',
    ];

    public $timestamps = false;

    public function terapista()
    {
        return $this->belongsTo(Utente::class, 'terapista_id');
    }

    public function utente()
    {
        return $this->belongsTo(Utente::class, 'utente_id');
    }
}
