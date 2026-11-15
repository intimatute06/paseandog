<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class HorarioController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('dueno/horario', [
            'usuario' => $request->user()->only(['hora_levantarse', 'hora_acostarse']),
            'bloques' => $request->user()->horarios()->orderBy('dia_semana')->orderBy('hora_inicio')->get(),
        ]);
    }

    public function actualizarHoras(Request $request)
    {
        $datos = $request->validate([
            'hora_levantarse' => ['required', 'date_format:H:i'],
            'hora_acostarse' => ['required', 'date_format:H:i', 'after:hora_levantarse'],
        ]);

        $request->user()->update($datos);
        return to_route('dueno.horario.index');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'dia_semana' => ['required', 'integer', 'between:1,7'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'hora_fin' => ['required', 'date_format:H:i', 'after:hora_inicio'],
            'tipo' => ['required', 'in:trabajo,estudio,otro'],
        ]);
        //aqui si el usuario todavia no guarda sus horas primordiales el sistema no le deja 
        $usuario = $request->user();
        if (!$usuario->hora_levantarse || !$usuario->hora_acostarse) {
            throw ValidationException::withMessages(['hora_inicio' => 'Primero guarda la hora de levantarse y de acostarse']);
        }

        // el bloque tiene que caber dentro del día (entre levantarse y acostarse)
        $levantarse = substr($usuario->hora_levantarse, 0, 5);
        $acostarse = substr($usuario->hora_acostarse, 0, 5);

        if($datos['hora_inicio'] < $levantarse || $datos['hora_fin'] > $acostarse){
            throw ValidationException::withMessages([
                'hora_inicio' => "El bloque tiene que estar entre $levantarse y $acostarse"
            ]);
            //me duermo a las 22:30 y me levanto a las 8:00
            // si quiero meter alguna actividad en esas horas el sistema no me va a dejar
        }


        // revisa si el bloque nuevo choca con alguno que ya tengo guardado el MISMO día:
        $cruza = $request->user()->horarios()
            ->where('dia_semana', $datos['dia_semana'])
            ->where('hora_inicio', '<', $datos['hora_fin'])
            ->where('hora_fin', '>', $datos['hora_inicio'])
            // esto se encarga de que 2 actividades no ocupenun mismo bloque
            ->exists();

        if ($cruza) {
            throw ValidationException::withMessages(['hora_inicio' => 'Este bloque se cruza con otro del mismo dia']);
        }

        $request->user()->horarios()->create($datos);
        return to_route('dueno.horario.index');
    }

    public function destroy(Request $request, Horario $horario){
        if($horario->user_id !== $request->user()->id){
            abort(403);
        }

        $horario->delete();
        return to_route('dueno.horario.index');


    }
}
