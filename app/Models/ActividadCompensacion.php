<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActividadCompensacion extends Model
{
    protected $table = 'actividades_compensacion';

    protected $fillable = [
        'nombre',
        'tipo',
        'duracion_min',
        'intensidad',
        'factor_equivalencia',
        'instrucciones',
    ];

}
