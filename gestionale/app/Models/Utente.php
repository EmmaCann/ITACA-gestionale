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
        'nome',
        'cognome',
        'username',
        'password',
        'email',
        'telefono',
        'nascita',
        'ruolo',
        'sesso',

        // Privacy & Termini
        'privacy_accepted_at',
        'privacy_version',
        'terms_accepted_at',
        'terms_version',
    ];


    protected $casts = [
        'privacy_accepted_at' => 'datetime',
        'terms_accepted_at'   => 'datetime',
    ];


    protected $hidden = [
        'password', // Nasconde la password nelle risposte JSON
    ];

    // Mutator per criptare la password automaticamente
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function getSessoLetteraAttribute()
    {
        if ($this->sesso === null) return null;
        return $this->sesso ? 'F' : 'M';
    }



    // Relazioni
    public function staffDati()
    {
        return $this->hasOne(StaffDati::class);
    }

    public function cartellaClinica()
    {
        return $this->hasOne(CartellaClinica::class, 'paziente_id');
    }

    public function appuntamentiComePaziente()
    {
        return $this->hasMany(Appuntamento::class, 'paziente_id');
    }

    public function appuntamentiComeTerapista()
    {
        return $this->hasMany(Appuntamento::class, 'terapista_id');
    }

    public function pagamentiRicevuti()
    {
        return $this->hasMany(Pagamento::class, 'terapista_id');
    }

    public function pagamentiEffettuati()
    {
        return $this->hasMany(Pagamento::class, 'paziente_id');
    }

    public function listaAttesa()
    {
        return $this->hasMany(ListaAttesa::class, 'utente_id');
    }

    public function tariffe()
    {
        return $this->hasMany(Tariffa::class, 'utente_id');
    }

    // Paziente -> Terapisti
    public function terapisti()
    {
        return $this->belongsToMany(
            Utente::class,
            'pazienti_terapisti',
            'paziente_id',
            'terapista_id'
        )->select('utente.id', 'nome', 'cognome');
    }

    // Terapista -> Pazienti (utile in futuro)
    public function pazienti()
    {
        return $this->belongsToMany(
            Utente::class,
            'pazienti_terapisti',
            'terapista_id',
            'paziente_id'
        )->select('utente.id', 'nome', 'cognome');
    }

    public function notifiche()
    {
        return $this->belongsToMany(
            Notifica::class,
            'notifica_utente',
            'utente_id',
            'notifica_id'
        )->withPivot('letta', 'letta_il')->withTimestamps();
    }
}
