<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alternativa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AlternativaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/alternativas/index', ['alternativas' => Alternativa::orderBy('nombre')->get()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/alternativas/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100', 'unique:alternativas','regex:/^[\pL\s\-]+$/u'],
            'aplica_a' => ['required', 'string', 'in:necesidades,comida'],
            'instrucciones' => ['required', 'string']
        ]);

        Alternativa::create($datos);

        return to_route('admin.alternativas.index');
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
    public function edit(Alternativa $alternativa)
    {
        return Inertia::render('admin/alternativas/edit', ['alternativa' => $alternativa]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alternativa $alternativa)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:100','regex:/^[\pL\s\-]+$/u', Rule::unique('alternativas')->ignore($alternativa->id)],
            'aplica_a' => ['required', 'string', 'in:necesidades,comida'],
            'instrucciones' => ['required', 'string'],
        ]);

        $alternativa->update($datos);

        return to_route('admin.alternativas.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alternativa $alternativa)
    {
        $alternativa->delete();

        return to_route('admin.alternativas.index');
    }
}
