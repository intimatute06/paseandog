<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    protected $fillable = [
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'tipo' 
    ];

    public function user(){
        return $this->belongsTo(User::class); 
    }
}
