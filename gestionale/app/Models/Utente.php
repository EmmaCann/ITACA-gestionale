<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Utente extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'utente';

    protected $fillable = [
        'username',
        'password',
        'email',
        'nome',
        'cognome',
        'nascita',
        'ruolo',
    ];

    protected $hidden = [
        'password', // Nasconde la password nelle risposte JSON
    ];

    // Mutator per criptare la password automaticamente
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
}
