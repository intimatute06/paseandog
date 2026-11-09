<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perro extends Model
{
    protected $fillable = [
        'raza_id',
        'nombre',
        'fecha_nacimiento',
        'peso_kg',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date'
        ];
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function raza(){
        return $this->belongsTo(Raza::class);
    }
}
