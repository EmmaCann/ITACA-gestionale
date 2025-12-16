<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemFlag extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $fillable = ['key', 'value'];
}

