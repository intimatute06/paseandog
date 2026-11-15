<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactoApoyo extends Model
{
    //como se llama la tabla que ya existe
    protected $table = 'contactos_apoyo';

    protected $fillable = [
        'nombre',
        'relacion',
        'telefono',
        'predeterminado',
    ];

    protected function casts(): array{
        return [
            'predeterminado' => 'boolean'
        ];
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
