<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;


class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/usuarios/index', [
            'usuarios' => User::orderBy('name')->get(['id', 'name', 'email', 'rol', 'estado']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     //
    // }

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
    public function edit(User $usuario)
    {
        return Inertia::render('admin/usuarios/edit', [
            'usuario' => $usuario->only(['id', 'name', 'email', 'rol', 'estado']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario)
    {
        $datos = $request->validate([
            'name' => ['required', 'string', 'max:255','regex:/\pL/u'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($usuario->id)],
            'estado' => ['required', 'in:activo,suspendido'],
        ]);

        
        if ($usuario->id === $request->user()->id && $datos['estado'] === 'suspendido') {
            throw ValidationException::withMessages([
                'estado' => 'No puedes suspender tu propia cuenta.',
            ]);
        }

        $usuario->update($datos);

        return to_route('admin.usuarios.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(string $id)
    // {
    //     //
    // }
}
