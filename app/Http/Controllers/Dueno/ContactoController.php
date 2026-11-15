<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use App\Models\ContactoApoyo;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContactoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('dueno/contactos/index',[
            'contactos' => $request->user()->contactos()->orderBy('nombre')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dueno/contactos/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->contactos()->count() >= 3) {
            throw ValidationException::withMessages(['limite' => 'Solo puedes registrar máximo 3 contactos.']);
        }

        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:50', 'regex:/^[\pL\s\-]+$/u'],
            'relacion' => ['required', 'string', 'max:30', 'regex:/^[\pL\s\-]+$/u'],
            'telefono' => ['required', 'string', 'max:15', 'regex:/^\+?[0-9 ]{7,15}$/'],
            'predeterminado' => ['boolean']

        ]);
        // si lo marco como principal, desmarco todos los demás
        if (!empty($datos['predeterminado'])) {
            $request->user()->contactos()->update(['predeterminado' => false]);
        }

        $request->user()->contactos()->create($datos);
        return to_route('dueno.contactos.index');
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, ContactoApoyo $contacto)
    {
        if ($contacto->user_id !== $request->user()->id) {
            abort(403);
        }
        return Inertia::render('dueno/contactos/edit', [
            'contacto' => $contacto,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactoApoyo $contacto)
    {
        if ($contacto->user_id !== $request->user()->id) {
            abort(403);
        }



        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:50', 'regex:/^[\pL\s\-]+$/u'],
            'relacion' => ['required', 'string', 'max:30', 'regex:/^[\pL\s\-]+$/u'],
            'telefono' => ['required', 'string', 'max:15', 'regex:/^\+?[0-9 ]{7,15}$/'],
            'predeterminado' => ['boolean']

        ]);
        // si lo marco como principal, desmarco todos los demás
        if (!empty($datos['predeterminado'])) {
            $request->user()->contactos()->update(['predeterminado' => false]);
        }

        $contacto->update($datos);
        return to_route('dueno.contactos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ContactoApoyo $contacto)
    {
        if ($contacto->user_id !== $request->user()->id) {
            abort(403);
        }

        $contacto->delete();
        return to_route('dueno.contactos.index');
    }
}
