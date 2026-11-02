<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etapa extends Model
{
    protected $fillable = [
        'nombre',
        'edad_min_meses',
        'edad_max_meses',
        'intervalo_max_horas',
        'salidas_min_dia',
    ];

    public function dietas()
    {
        return $this->hasMany(Dieta::class);
    }
}
