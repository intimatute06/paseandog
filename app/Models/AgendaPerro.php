<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgendaPerro extends Model
{
    protected $table = 'agenda_perros';

    protected $fillable = [
        'perro_id',
        'estado',
        'minutos_requeridos',
        'minutos_realizados',
        'intensidad',
        'porcion_g',
        'nota',
    ];

    public function agenda(){
        return $this->belongsTo(Agenda::class); 
    }

    public function perro(){
        return $this->belongsTo(Perro::class);
    }
}
