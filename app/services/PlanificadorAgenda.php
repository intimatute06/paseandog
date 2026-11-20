<?php

//donde esta ubicado en que carpeta
namespace App\Services;
//el model user

use App\Models\Etapa;
use App\Models\User;
use Carbon\Carbon;

class PlanificadorAgenda
{
    //aqui va el metodo principal:el controlador solo va a llamar a este
    //el resto es private por que solo los usa este planificador
    public function generarAgenda(User $user): void
    {
        //es void por que solo guarda la agenda  

        $fecha = Carbon::today();
        // antes de generar, borro la agenda de este usuario desde esa fecha en adelante (para no duplicar)
        $user->agenda()->where('fecha', '>=', $fecha->toDateString())->delete();



        $intervaloMenor = 24; //cualquier perro podria ganarlo




        foreach ($user->perros as $perro) { //por cada perro de usuario lo llamamos perro

            //llamaos al metodo de la misma clase para el perro del usuario
            $etapa = $this->calcularEtapa($perro);
            $intervalo = $this->calcularIntervalo($perro, $etapa);

            if ($intervalo < $intervaloMenor) {
                $intervaloMenor = $intervalo;
            }
        }

        for ($i = 0; $i < 7; $i++) {
            //obtenemos el dia por cada vuelta fecha(15)+1+2 y asi
            $dia = $fecha->copy()->addDays($i);

            //los huecos de ese día: dayOfWeekIso pasa la fecha a su número (1 = lunes ... 7 = domingo)
            $libres = $this->bloquesLibres($user, $dia->dayOfWeekIso);

            // ubicar las salidas de ESE día
            $this->ubicarNecesidades($user, $user->perros, $dia->toDateString(), $libres, $intervaloMenor);
        }
        //ubicar y guardar las necesidades de los perros una sola vez
       
    }


    //segun la edad, que etapa pertenece cada perro
    private function calcularEtapa($perro)
    {
        //se calcula la edad con la fecha actual menos la fecha de nacimiento
        $edadMeses = (int) $perro->fecha_nacimiento->diffInMonths(now());
        //traemos todas las etapas del Modelo Etaoa
        $etapas = Etapa::all();
        //el primer foreach comparamos la edad una por una
        foreach ($etapas as $etapa) {
            if ($edadMeses >= $etapa->edad_min_meses && $edadMeses <= $etapa->edad_max_meses) {
                return $etapa;
            }
            //esto recorre las etapas que tengamo
            //compara la edad de meses y si es mayor o igual a la etapa min de meses y tambien 
            //es menor o igual a la etapa max de meses se regresa es decir si cachorro esta entre
            //0 y 6 meses y pongo un perro de 2 meses 2 es mayor que 0 y es menor que 6 entonces es cachorro
            // si no se cumple busca con la siguiente etapa

        }
        return null;
    }

    //intervalo de salidas entre etapas y enfermedades
    private function calcularIntervalo($perro, $etapa)
    {
        //intervalo maximo de las estapas
        $intervalo = $etapa->intervalo_max_horas;
        foreach ($perro->enfermedades as $registro) {
            if ($registro->activa && $registro->enfermedad->intervalo_max_horas !== null && $intervalo > $registro->enfermedad->intervalo_max_horas) {
                $intervalo = $registro->enfermedad->intervalo_max_horas;
            }
        }
        return (float) $intervalo;
    }




    //huecos libres del dia entre levantarse y acostarse menos los bloques ocupados
    private function bloquesLibres($usuario, $diaSemana)
    {
        // bloques ocupados del dueño ese día, ordenados por hora de inicio                   //        busacar por esa columna
        $bloques = $usuario->horarios()->where('dia_semana', $diaSemana)->orderBy('hora_inicio')->get();
        //al principio vacia, se agrega en el for each
        $libres = [];

        //el agente de busqeuda se podria decir
        //arranca cuando se levanta 
        $cursor = $usuario->hora_levantarse;


        foreach ($bloques as $bloque) {
            //si el cursor es menor a la hora de inicio hay bloque libre
            if ($cursor < $bloque->hora_inicio) {
                //el hueco va desde el cursor hasta que empieza el bloque
                $libres[] = ['inicio' => $cursor, 'fin' => $bloque->hora_inicio];
            }
            //siempre salta al final del bloque para empezar la comparativa
            $cursor = $bloque->hora_fin;
        }

        //si hay chance de antes de la hora de acostarse
        //con usuario por que usuario tiene la hora de acostarse
        if ($cursor < $usuario->hora_acostarse) {
            $libres[] = ['inicio' => $cursor, 'fin' => $usuario->hora_acostarse];
        }
        //regresa la lista con huecos del dia
        return $libres;
    }

    //ubicar las salidas de necesidades segun el intervalo
    private function ubicarNecesidades($user, $perros, $fecha, $libres, $intervalo)
    {
        //LA HORA ARRANCA  al levantarse y el limite es acostar
        //carbon para que la hora sea objeto que se pueda calcular el intervalo
        $hora = Carbon::parse($user->hora_levantarse);
        $acostarse = Carbon::parse($user->hora_acostarse);

        //para empezar a colocar las necesidades en los huecos libres
        while ($hora < $acostarse) {
            $alerta = 'Sin hueco libre:delegar o usar alternativa';
            $textohora = $hora->format('H:i:s'); //convierte el carbon a texto por la base horario
            //de la funcion de arriba traemos el inicio y el fin
            foreach ($libres as $hueco) {
                //aqui se compara texto con texto
                if ($textohora >= $hueco['inicio'] && $textohora <= $hueco['fin']) {
                    $alerta = null;
                }
            }

            //guardar el evento en la agenda gracias al user_id lo pone en relacion
            $evento = $user->agenda()->create([
                'fecha' => $fecha,
                'hora_inicio' => $textohora,
                'duracion_min' => 15,
                'tipo' => 'necesidades',
                'alerta' => $alerta,
            ]);

            //guardar a los perros participa en ese evento
            foreach ($perros as $perro) {

                $evento->agendaperro()->create([
                    'perro_id' => $perro->id,
                ]);
            }

            //convertir hora a minutos para las horas fraccion no se pierdan
            $hora->addMinutes($intervalo * 60);
        }
    }

    //ubicar las comidas segun la dieta
    private function ubicarComidas() {}

    //convertir salidas en paseos
    private function convertirEnPaseos() {}

    //resolver conflictos: borde, delegaciones, alternativas, alertas
    private function resolverConflicto() {}
}
