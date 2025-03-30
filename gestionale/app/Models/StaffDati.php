<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffDati extends Model
{
    protected $table = 'staff_dati';

    protected $fillable = [
        'utente_id',
        'professione',
    ];

    public $timestamps = false;

    public function utente()
    {
        return $this->belongsTo(Utente::class);
    }
}
