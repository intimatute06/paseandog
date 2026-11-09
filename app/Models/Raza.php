<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Raza extends Model
{
    protected $fillable = [
        'nombre',
        'tamano',
        'nivel_energia',
        'minutos_paseo_dia',
    ];

 
    public function perros(){
        return $this->hasMany(Perro::class);
    }
}

