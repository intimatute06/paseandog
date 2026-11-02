<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alternativa extends Model
{
    protected $fillable = [
        'nombre',
        'aplica_a',
        'instrucciones',
    ];
}
