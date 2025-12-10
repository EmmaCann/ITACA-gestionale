<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifica extends Model
{
    protected $table = 'notifiche';

    protected $fillable = [
        'admin_id',
        'titolo',
        'messaggio',
        'tipologia',
        'urgenza'
    ];

    public function admin()
    {
        return $this->belongsTo(Utente::class, 'admin_id');
    }

    public function destinatari()
    {
        return $this->belongsToMany(
            Utente::class,
            'notifica_utente',
            'notifica_id',
            'utente_id'
        )->withPivot('letta', 'letta_il')->withTimestamps();
    }
}
