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
        Schema::create('agenda', function (Blueprint $table) {
            $table->id();
            //primero apuntamos al usuario, si el usuario borra su cuenta se borra su agenda
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('fecha');
            $table->time('hora_inicio');
            //paraenteros postivios
            $table->unsignedSmallInteger('duracion_min');
            $table->string('tipo', 20);
            //si borro al contacto el evento se borra el contacto
            $table->foreignId('contacto_id')->nullable()->constrained('contactos_apoyo')->nullOnDelete();
            //no le deja al admin borrar si un usuario tiene usado
            $table->foreignId('alternativa_id')->nullable()->constrained('alternativas')->restrictOnDelete();
            $table->foreignId('actividad_id')->nullable()->constrained('actividades_compensacion')->restrictOnDelete();
            //apunta a la misma tabla
            $table->foreignId('compensa_agenda_id')->nullable()->constrained('agenda')->nullOnDelete();
            $table->string('alerta')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda');
    }
};
