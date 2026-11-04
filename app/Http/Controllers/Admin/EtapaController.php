<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Validation\Rule;
use App\Models\Etapa;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EtapaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/etapas/index', ['etapas' => Etapa::orderBy('edad_min_meses')->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/etapas/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100', 'unique:etapas'],
            'edad_min_meses' => ['required', 'integer', 'min:0'],
            'edad_max_meses' => ['required', 'integer', 'gt:edad_min_meses', 'max:240'],
            'intervalo_max_horas' => ['required', 'numeric', 'decimal:0,1', 'min:0.5', 'max:24'],
            'salidas_min_dia' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $cruce = Etapa::where('edad_min_meses', '<=', $datos['edad_max_meses'])
            ->where('edad_max_meses', '>=', $datos['edad_min_meses'])
            ->exists();
        if ($cruce) {
            throw ValidationException::withMessages([
                'edad_min_meses' => 'El rango de edad se cruza con otra etapa.',
            ]);
        }


        Etapa::create($datos);

        return to_route('admin.etapas.index');
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
    public function edit(Etapa $etapa)
    {
        return Inertia::render('admin/etapas/edit', ['etapa' => $etapa]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Etapa $etapa)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100', Rule::unique('etapas')->ignore($etapa->id)],
            'edad_min_meses' => ['required', 'integer', 'min:0'],
            'edad_max_meses' => ['required', 'integer', 'gt:edad_min_meses', 'max:240'],
            'intervalo_max_horas' => ['required', 'numeric', 'decimal:0,1', 'min:0.5', 'max:24'],
            'salidas_min_dia' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $cruce = Etapa::where('edad_min_meses', '<=', $datos['edad_max_meses'])
            ->where('edad_max_meses', '>=', $datos['edad_min_meses'])
            ->where('id', '!=', $etapa->id)
            ->exists();
        if ($cruce) {
            throw ValidationException::withMessages([
                'edad_min_meses' => 'El rango de edad se cruza con otra etapa.',
            ]);
        }

        $etapa->update($datos);

        return to_route('admin.etapas.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Etapa $etapa)
    {

        if ($etapa->dietas()->exists()) {
            return back()->withErrors([
                'borrar' => 'No se puede borrar esta etapa porque hay dietas que la usan.',
            ]);
        }
        
        $etapa->delete();

        return to_route('admin.etapas.index');
    }
}
