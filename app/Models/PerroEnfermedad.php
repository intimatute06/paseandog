<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerroEnfermedad extends Model
{
    protected $table = "perro_enfermedades";
    //el nombre exacto de esta tabla para llamarla
    protected $fillable = [
        'enfermedad_id',
        'activa',
        // son los 2 campos que  se rellenan solo la enfermedad 
        // y si esta activa
    ];

    protected function casts(): array
    {
        return [
            'activa' => 'boolean',
            //cuando leas activa es true para que entienda laravel
        ];
    }

    public function perro()
    {
        // un perro tiene muchos registros de enfermedades
        return $this->belongsTo(Perro::class);
    }

    public function enfermedad()
    {
        // cada registro apunta a una enfermedad del catálogo
        return $this->belongsTo(Enfermedad::class);
    }
}
