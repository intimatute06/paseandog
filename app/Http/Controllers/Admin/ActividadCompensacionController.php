<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActividadCompensacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActividadCompensacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/actividades/index', ['actividades' => ActividadCompensacion::orderBy('nombre')->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/actividades/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'tipo' => ['required', 'string', 'in:mental,en_casa'],
            'duracion_min' => ['required', 'integer', 'min:1', 'max:120'],
            'intensidad' => ['required', 'string', 'in:baja,media,alta'],
            'factor_equivalencia' => ['required', 'numeric', 'decimal:0,2', 'min:0.1', 'max:5'],
            'instrucciones' => ['required', 'string'],
        ]);

        ActividadCompensacion::create($datos);

        return to_route('admin.actividades.index');
    }

    /**
     * Display the specified resource.
     */
    // public function show(string $id)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActividadCompensacion $actividad)
    {
        return Inertia::render('admin/actividades/edit', ['actividad' => $actividad]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActividadCompensacion $actividad)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'tipo' => ['required', 'string', 'in:mental,en_casa'],
            'duracion_min' => ['required', 'integer', 'min:1', 'max:120'],
            'intensidad' => ['required', 'string', 'in:baja,media,alta'],
            'factor_equivalencia' => ['required', 'numeric', 'decimal:0,2', 'min:0.1', 'max:5'],
            'instrucciones' => ['required', 'string'],
        ]);

        $actividad->update($datos);

        return to_route('admin.actividades.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActividadCompensacion $actividad)
    {
        $actividad->delete();

        return to_route('admin.actividades.index');
    }
}
