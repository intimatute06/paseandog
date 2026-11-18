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
        //tabla intermediaria entre perros y agenda
        Schema::create('agenda_perros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agenda_id')->constrained('agenda')->cascadeOnDelete();
            $table->foreignId('perro_id')->constrained('perros')->cascadeOnDelete();
            //pendiente de marcar, todo evento nace como pendiente
            $table->string('estado', 20)->default('pendiente');
            $table->unsignedSmallInteger('minutos_requeridos')->nullable();
            //nullable por que los minutos al principio no deben estar marcados
            $table->unsignedSmallInteger('minutos_realizados')->nullable();
            $table->string('intensidad', 30)->nullable();
            $table->decimal('porcion_g', 5,2)->nullable();
            $table->text('nota')->nullable();
            //no se pueden repetir 2 veces misma pareja evento
            $table->unique(['agenda_id', 'perro_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda_perros');
    }
};
