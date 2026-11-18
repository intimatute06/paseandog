<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    protected $table = 'agenda';

    protected $fillable = [
        'fecha',
        'hora_inicio',
        'duracion_min',
        'tipo',
        'contacto_id',
        'alternativa_id',
        'actividad_id',
        //de la misma tabla
        'compensa_agenda_id',
        'alerta'
    ];
    //tenemos le cast pata que el texto se convierta en 
    //fecha manipulable

    protected function casts(): array{
        return[
            'fecha'=> 'date'
        ];
    }
    //tengo que unir a la clase user
    public function user(){
        return $this->belongsTo(User::class);
    }
    //y tambien con perros pero la agenda por que esto
    //es una agenda del perro y del usuario
    //en este caso es hasmany por que puede tener muchos perros
    public function agendaperro(){
        return $this->hasMany(AgendaPerro::class);
    }
}
