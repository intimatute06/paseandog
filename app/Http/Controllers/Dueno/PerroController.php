<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use App\Models\Perro;
use App\Models\Raza;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PerroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perros = $request->user()->perros()->with('raza')->get();
        return Inertia::render('dueno/perros/index', ['perros' => $perros]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dueno/perros/create', [
            'razas' => Raza::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->perros()->count() >= 2) {
            throw ValidationException::withMessages(['limite' => 'Solo puedes registrar máximo 2 perros.']);
        }

        $datos = $request->validate([
            'raza_id' => ['required', 'integer', 'exists:razas,id'],
            'nombre' => ['required', 'string', 'max:50', 'regex:/^[\pL\s\-]+$/u'],
            'fecha_nacimiento' => ['required', 'date', 'before_or_equal:today'],
            'peso_kg' => ['required', 'numeric', 'decimal:0,2', 'min:0.5', 'max:150'],
        ]);

        $request->user()->perros()->create($datos);
        return to_route('dueno.perros.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Perro $perro)
    {
        if ($perro->user_id !== $request->user()->id) {
            abort(403);
        }

        $perro->delete();
        return to_route('dueno..perros.index');
    }
}
