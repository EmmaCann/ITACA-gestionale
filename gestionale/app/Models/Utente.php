
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use App\Models\StaffDati;
// use App\Models\CartellaClinica;
// use App\Models\Appuntamento;
// use App\Models\Pagamento;
// use App\Models\ListaAttesa;

class Utente extends Authenticatable
{
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
    ];

    protected $casts = [
        'nascita' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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
}
