<?php

use App\Http\Controllers\Admin\AlternativaController;
use App\Http\Controllers\Admin\ActividadCompensacionController;
use App\Http\Controllers\Admin\DietaController;
use App\Http\Controllers\Admin\EnfermedadController;
use App\Http\Controllers\Admin\EtapaController;
use App\Http\Controllers\Admin\RazaController;
use App\Http\Controllers\Admin\UsuarioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('razas', RazaController::class)->except(['show']);
    Route::resource('etapas', EtapaController::class)->except(['show']);
    Route::resource('enfermedades', EnfermedadController::class)
        ->except(['show'])
        ->parameters(['enfermedades' => 'enfermedad']);
    Route::resource('dietas', DietaController::class)->except(['show']);
    Route::resource('actividades', ActividadCompensacionController::class)
        ->except(['show'])
        ->parameters(['actividades' => 'actividad']);

    Route::resource('alternativas', AlternativaController::class)->except(['show']);
    Route::resource('usuarios', UsuarioController::class)
        ->only(['index', 'edit', 'update'])
        ->parameters(['usuarios' => 'usuario']);
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
