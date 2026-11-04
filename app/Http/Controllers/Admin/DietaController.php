<?php

namespace App\Http\Controllers\Admin;

use App\Models\Etapa;
use App\Models\Enfermedad;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dieta;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class DietaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/dietas/index', ['dietas' => Dieta::with(['etapa', 'enfermedad'])->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/dietas/create', [
            'etapas' => Etapa::orderBy('edad_min_meses')->get(['id', 'nombre']),
            'enfermedades' => Enfermedad::orderBy('nombre')->get(['id', 'nombre']),
            'existentes' => Dieta::get(['etapa_id', 'enfermedad_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'etapa_id' => ['required', 'integer', 'exists:etapas,id',],
            'enfermedad_id' => ['nullable', 'integer', 'exists:enfermedades,id'],
            'comidas_dia' => ['required', 'integer', 'min:1', 'max:6'],
            'porcion_por_kg' => ['required', 'numeric', 'decimal:0,2', 'min:1', 'max:100'],
            'recomendaciones' => ['nullable', 'string'],
        ]);

        $repetida = Dieta::where('etapa_id', $datos['etapa_id'])
            ->where('enfermedad_id', $datos['enfermedad_id'])
            ->exists();

        if ($repetida) {
            throw ValidationException::withMessages([
                'enfermedad_id' => 'Ya existe una dieta para esta etapa y enfermedad.',
            ]);
        }

        Dieta::create($datos);

        return to_route('admin.dietas.index');
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
    public function edit(Dieta $dieta)
    {
        return Inertia::render('admin/dietas/edit', [
            'dieta' => $dieta,
            'etapas' => Etapa::orderBy('edad_min_meses')->get(['id', 'nombre']),
            'enfermedades' => Enfermedad::orderBy('nombre')->get(['id', 'nombre']),
            'existentes' => Dieta::where('id', '!=', $dieta->id)->get(['etapa_id', 'enfermedad_id']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dieta $dieta)
    {
        $datos = $request->validate([
            'etapa_id' => ['required', 'integer', 'exists:etapas,id'],
            'enfermedad_id' => ['nullable', 'integer', 'exists:enfermedades,id'],
            'comidas_dia' => ['required', 'integer', 'min:1', 'max:6'],
            'porcion_por_kg' => ['required', 'numeric', 'decimal:0,2', 'min:1', 'max:100'],
            'recomendaciones' => ['nullable', 'string'],
        ]);

        $repetida = Dieta::where('etapa_id', $datos['etapa_id'])
            ->where('enfermedad_id', $datos['enfermedad_id'])
            ->where('id', '!=', $dieta->id)     
            ->exists();

        if ($repetida) {
            throw ValidationException::withMessages([
                'enfermedad_id' => 'Ya existe una dieta para esta etapa y enfermedad.',
            ]);
        }

        $dieta->update($datos);             

        return to_route('admin.dietas.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dieta $dieta)
    {
        $dieta->delete();

        return to_route('admin.dietas.index');
    }
}
