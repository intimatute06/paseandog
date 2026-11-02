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
        Schema::create('dietas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etapa_id')->constrained('etapas')->restrictOnDelete();
            $table->foreignId('enfermedad_id')->nullable()->constrained('enfermedades')->restrictOnDelete();
            $table->integer('comidas_dia');
            $table->decimal('porcion_por_kg', 5, 2);
            $table->text('recomendaciones')->nullable();
            $table->timestamps();
            $table->unique(['etapa_id', 'enfermedad_id'])->nullsNotDistinct();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dietas');
    }
};
