<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dieta extends Model
{
    protected $fillable = [
        'etapa_id',
        'enfermedad_id',
        'comidas_dia',
        'porcion_por_kg',
        'recomendaciones',
    ];
    public function etapa()
    {
        return $this->belongsTo(Etapa::class);
    }

    public function enfermedad()
    {
        return $this->belongsTo(Enfermedad::class);
    }
}
