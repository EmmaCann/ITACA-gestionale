<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartellaClinicaFile extends Model
{
    protected $table = 'cartella_clinica_files';

    protected $fillable = [
        'paziente_id',
        'uploaded_by',
        'original_name',
        'file_path',
        'mime_type',
        'file_size',
    ];

    public function paziente()
    {
        return $this->belongsTo(Utente::class, 'paziente_id');
    }

    public function uploader()
    {
        return $this->belongsTo(Utente::class, 'uploaded_by');
    }
}
