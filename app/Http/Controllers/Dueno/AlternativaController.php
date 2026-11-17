<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Alternativa;

//solo muestra las opciones y el usuario las marca si quiere o no.

class AlternativaController extends Controller
{

    public function index(Request $request){
        //traigo a las alternativas completas para mostrar todas las casilllas
        $alternativas = Alternativa::orderBy('nombre')->get(['id', 'nombre', 'aplica_a']);
        return Inertia::render('dueno/alternativas',['alternativas' => $alternativas,
        //el pluck solo sirve para que nos de las columnas con el id para que sea mas facil manipular la informacion
        'marcadas' => $request->user()->alternativas()->pluck('alternativas.id')]);
    }

    public function guardar(Request $request){
        $datos = $request->validate([
            'alternativas' => ['array'],
            //cada id  que llega a la lista es un numero 
            //y debe existir, recorre las alternativas que selecciono el usuario 
            //y valida que exista
            'alternativas.*' => ['integer', 'exists:alternativas,id'],
        ]);

       $request->user()->alternativas()->sync($datos['alternativas'] ?? []);
       return to_route('dueno.alternativas.index');
    }

    


}
