<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Enfermedad;
use App\Models\Perro;
use App\Models\PerroEnfermedad;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\CssSelector\Node\FunctionNode;

class PerroEnfermedadController extends Controller
{
    public function index(Request $request, Perro $perro)
    {
        if ($perro->user_id !== $request->user()->id) {
            abort(403);
        }
        //el clsico para que solo pueda ingresar al perro suyo
        //y no a otro

        return Inertia::render('dueno/perros/enfermedades', [
            //es perro traemos al perro
            'perro' => $perro,
            // las enfermedades de ESTE perro, con el nombre de cada una
            'registros' => $perro->enfermedades()->with('enfermedad')->get(),
            // el catálogo completo del admin, para el dropdown de agregar
            'enfermedades' => Enfermedad::orderBy('nombre')->get(['id', 'nombre']),

        ]);
    }

    public function store(Request $request, Perro $perro)
    {
        if ($perro->user_id !== $request->user()->id) {
            abort(403);
        }
        $datos = $request->validate([
            'enfermedad_id' => [
                'required',
                'exists:enfermedades,id',
                Rule::unique('perro_enfermedades')->where('perro_id', $perro->id),
            ],
            //que la enfermedad exista y que el perro no tenga esa enfermedad ya 
            //el rule lo que hace es ver la tabla y mira si el enfermedad ya esta ahi y el where es para ver las de ese perro
        ]);

        $perro->enfermedades()->create($datos);
        //el perro por que estamos hablando del perro, las enfermedades,
        //y creamos los datos

        return to_route('dueno.perros.enfermedades.index', $perro);
    }

    public function update(Request $request, Perro $perro, PerroEnfermedad $registro)
    {
        if ($perro->user_id !== $request->user()->id || $registro->perro_id !== $perro->id) {
            abort(403);
        }
        $registro->update(['activa' => !$registro->activa]);
        //aqui esta la invertida de registro activo
        return to_route('dueno.perros.enfermedades.index', $perro);
    }



    public function destroy(Request $request, Perro $perro, PerroEnfermedad $registro)
    {
        if ($perro->user_id !== $request->user()->id || $registro->perro_id !== $perro->id) {
            abort(403);
        }
        //en este caso solo queremos borrar el registro 
        //no todas las enfermedades

        $registro->delete();
        return to_route('dueno.perros.enfermedades.index', $perro);
    }
}
