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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }
}
