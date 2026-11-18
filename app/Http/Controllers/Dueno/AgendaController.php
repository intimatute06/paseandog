<?php

namespace App\Http\Controllers\Dueno;

use App\Http\Controllers\Controller;
use App\Services\PlanificadorAgenda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgendaController extends Controller
{
    //el controlador no piensa: solo llama al core para que arme la agenda
    public function generar(Request $request, PlanificadorAgenda $planificador)
    {
        $planificador->generarAgenda($request->user());
        return to_route('dueno.agenda.index');
    }

    //index siemre index

    public function index(Request $request){
        //los eventos para la agenda
        $eventos =  $request->user() //la persona
        ->agenda()//sus eventos
        ->with('agendaperro.perro')//con la agenda del perro que sirve de camino para traer el nombre del perro gracias a la conexion agenda
        ->orderBy('fecha')//ordenados por diay dentro del dia 
        ->orderBy('hora_inicio')//por hota
        ->get();//trae la lista
        return Inertia::render('dueno/agenda',['eventos'=> $eventos]);
    }
}
