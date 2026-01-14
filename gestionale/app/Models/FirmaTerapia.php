<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class FirmaTerapia extends Model
{
    protected $table = 'firma_terapia';
    public $timestamps = false;

    protected $fillable = [
        'firma_id',
        'terapia',
    ];
}
