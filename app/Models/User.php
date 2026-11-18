<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'estado',
        'hora_levantarse',
        'hora_acostarse'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function perros()
    {
        return $this->hasMany(Perro::class);
    }

    public function horarios()
    {
        return $this->hasMany(Horario::class);
    }
    public function contactos()
    {
        return $this->hasMany(ContactoApoyo::class);
    }
    public function alternativas(){
        return $this->belongsToMany(Alternativa::class,'dueno_alternativas');
    }
    public function agenda(){
        //has many por que usuarios pueden tener varias eventos en su agenda
        return $this->hasMany(Agenda::class);
    }
}
