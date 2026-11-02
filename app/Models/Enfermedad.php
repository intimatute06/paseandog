<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enfermedad extends Model
{
    protected $table = 'enfermedades';

    protected $fillable = [
        'nombre',
        'descripcion',
        'intensidad_max',
        'intervalo_max_horas',
        'restriccion_alimentaria',
    ];
    
    public function dietas()
    {
        return $this->hasMany(Dieta::class);
    }
}
