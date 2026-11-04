<?php

namespace App\Http\Controllers\Admin;

use App\Models\Enfermedad;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class EnfermedadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/enfermedades/index', ['enfermedades' => Enfermedad::orderBy('nombre')->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/enfermedades/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100', 'unique:enfermedades'],
            'descripcion' => ['nullable', 'string'],
            'intensidad_max' => ['nullable', 'string', 'in:baja,media,alta'],
            'intervalo_max_horas' => ['nullable', 'numeric', 'decimal:0,1', 'min:0.5', 'max:24'],
            'restriccion_alimentaria' => ['nullable', 'string'],

        ]);

        Enfermedad::create($datos);

        return to_route('admin.enfermedades.index');
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
    public function edit(Enfermedad $enfermedad)
    {
        return Inertia::render('admin/enfermedades/edit', ['enfermedad' => $enfermedad]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enfermedad $enfermedad)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100',  Rule::unique('enfermedades')->ignore($enfermedad->id)],
            'descripcion' => ['nullable', 'string'],
            'intensidad_max' => ['nullable', 'string', 'in:baja,media,alta'],
            'intervalo_max_horas' => ['nullable', 'numeric', 'decimal:0,1', 'min:0.5', 'max:24'],
            'restriccion_alimentaria' => ['nullable', 'string'],

        ]);


        $enfermedad->update($datos);

        return to_route('admin.enfermedades.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enfermedad $enfermedad)
    {

        if ($enfermedad->dietas()->exists()) {
            return back()->withErrors([
                'borrar' => 'No se puede borrar esta etapa porque hay dietas que la usan.',
            ]);
        }

        $enfermedad->delete();

        return to_route('admin.enfermedades.index');
    }
}
