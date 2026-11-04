<?php

namespace App\Http\Controllers\Admin;

use App\Models\Raza;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class RazaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/razas/index', ['razas' => Raza::orderBy('nombre')->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/razas/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100', 'unique:razas','regex:/^[\pL\s\-]+$/u'],
            'tamano' => ['required', 'string', 'max:20'],
            'nivel_energia' => ['required', 'string', 'max:20'],
            'minutos_paseo_dia' => ['required', 'integer', 'min:1', 'max:500'],
        ]);

        Raza::create($datos);

        return to_route('admin.razas.index');
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
    public function edit(Raza $raza)
    {
        return Inertia::render('admin/razas/edit', ['raza' => $raza]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Raza $raza)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100','regex:/^[\pL\s\-]+$/u', Rule::unique('razas')->ignore($raza->id)],
            'tamano' => ['required', 'string', 'max:20'],
            'nivel_energia' => ['required', 'string', 'max:20'],
            'minutos_paseo_dia' => ['required', 'integer', 'min:1', 'max:500'],
        ]);

        $raza->update($datos);

        return to_route('admin.razas.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Raza $raza)
    {
        $raza->delete();
        
        return to_route('admin.razas.index');
    }
}
