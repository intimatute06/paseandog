<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('perro_enfermedades', function (Blueprint $table) {
            $table->id();
            //recordatorio de que foreignId es crea la columna perro id y constrained es la conexion
            $table->foreignId('perro_id')->constrained('perros')->cascadeOnDelete();
            //cascada por que si se borra el perro, se borran sus registros de enfermedades
            $table->foreignId('enfermedad_id')->constrained('enfermedades')->restrictOnDelete();
            //restrict por que si el admin intenta borrar esa enfermedad no deberia dejarle 
            $table->boolean('activa')->default(true);
            // si un usuario crea una enfermedad es por que es activa
            $table->timestamps();
            $table->unique(['perro_id','enfermedad_id']);
            // no se puede repetir el perro y la misma enfermedad 2 veces
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perro_enfermedades');
    }
};
