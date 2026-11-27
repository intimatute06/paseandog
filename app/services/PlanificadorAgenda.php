<?php


namespace App\Services;


use App\Models\Dieta;
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


        //para los 2 perros
        $intervaloMenor = 24; //cualquier perro podria ganarlo


        $perrosQueComen = [];
        $perrosPaseo = [];

        //para la meta de paseos
        $metaPaseo = 0;

        foreach ($user->perros as $perro) { //por cada perro de usuario lo llamamos perro

            //llamaos al metodo de la misma clase para el perro del usuario
            $etapa = $this->calcularEtapa($perro);
            $intervalo = $this->calcularIntervalo($perro, $etapa);
            $dieta = $this->buscarDieta($perro, $etapa);
            $perrosQueComen[] = [
                'perro'   => $perro,
                'comidas' => $dieta->comidas_dia,
                'porcion' => $this->calcularPorcion($perro, $dieta),
            ];
            $perrosPaseo[] = [
                'perro' => $perro,
                'meta' => $perro->raza->minutos_paseo_dia,
                'intensidad' => $this->calcularIntensidad($perro),

            ];


            if ($intervalo < $intervaloMenor) {
                $intervaloMenor = $intervalo;
            }

            //para los paseos compartidos
            if ($perro->raza->minutos_paseo_dia > $metaPaseo) {
                $metaPaseo = $perro->raza->minutos_paseo_dia;
            }
        }


        for ($i = 0; $i < 7; $i++) {
            //obtenemos el dia por cada vuelta fecha(dia)+1+2 y asi
            $dia = $fecha->copy()->addDays($i);

            //los huecos de ese día: dayOfWeekIso pasa la fecha a su número1 =lunes 7=domingo
            $libres = $this->bloquesLibres($user, $dia->dayOfWeekIso);

            //ubicar las salidas de ESE dia y quedarme con las que podrian ser paseo
    
            $candidatasPaseo = $this->ubicarNecesidades($user, $user->perros, $dia->toDateString(), $libres, $intervaloMenor);

            // convertir en paseo las mejores candidatas hasta cumplir la meta
            $this->convertirEnPaseos($candidatasPaseo, $metaPaseo, $perrosPaseo);

            $this->ubicarComidas($user, $perrosQueComen, $dia->toDateString(), $libres);

            
        }
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

    //intensidad del paseo, normal a menos que el perro tenga enfermedad
    private function calcularIntensidad($perro){
        $intensidad = $perro->raza->nivel_energia;
        foreach($perro->enfermedades as $registro){
            if($registro->activa && $registro->enfermedad->intensidad_max !== null){
                $intensidad = $registro->enfermedad->intensidad_max;

            }
        }
        return $intensidad;
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

    //esta libre ya que 2 funciones cumplen el mismo objetivo
    private function estaLibre($horaSalida, $libres)
    {
        foreach ($libres as $hueco) {
            if ($horaSalida >= $hueco['inicio'] && $horaSalida <= $hueco['fin']) {
                return true;  // cabe en este hueco sí está libre
            }
        }
        //no esta libre 
        return false;
    }

    //servira para saber cuanto tiempo hay
    private function buscarHueco($horaSalida, $libres)
    {
        foreach ($libres as $hueco) {
            if ($horaSalida >= $hueco['inicio'] && $horaSalida <= $hueco['fin']) {
                //devuelvo para saber el fin dell hueci
                return $hueco;
            }
        }
        //no regresa nada
        return null;
    }

    //ubicar las salidas de necesidades segun el intervalo
    private function ubicarNecesidades($user, $perros, $fecha, $libres, $intervalo)
    {
        //LA HORA ARRANCA  al levantarse y el limite es acostar
        $hora = Carbon::parse($user->hora_levantarse); //carbon para que la hora sea objeto que se pueda calcular el intervalo
        $acostarse = Carbon::parse($user->hora_acostarse);

        //armar la lista de horas de salida segun el intervalo
        $horasSalida = [];
        while($hora<$acostarse){
            $horasSalida[] = $hora->copy();
            $hora->addMinutes($intervalo * 60);
        }
        //arreglo de la ultima salida debe salir antes de dormir
        $ultima = end($horasSalida);
        if($ultima->diffInMinutes($acostarse) > 60){
            $horasSalida[] = $acostarse->copy()->subMinutes(15);
        }


        //candidatas que podrian ser paseo
        $candidatasPaseo = [];

        //para empezar a colocar las necesidades en los huecos libres
        foreach($horasSalida as $horaSalidaCarbon) {
            // la hora en texto, para comparar con los huecos y guardar
            $horaSalida = $horaSalidaCarbon->format('H:i:s');

            // Pregunta a la funcion
            $alerta = $this->estaLibre($horaSalida, $libres) ? null : 'Sin hueco libre: delegar o usar alternativa';

            //guardar el evento en la agenda gracias al user_id lo pone en relacion
            $evento = $user->agenda()->create([
                'fecha' => $fecha,
                'hora_inicio' => $horaSalida,
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

            //si cae en un hueco, la anoto con los minutos que quedan hasta que termina
            $hueco = $this->buscarHueco($horaSalida, $libres);
            if ($hueco) {
                $candidatasPaseo[] = [
                    'evento' => $evento,
                    'disponible' => $horaSalidaCarbon->diffInMinutes(Carbon::parse($hueco['fin'])),
                ];
            }
        }
        return $candidatasPaseo;
    }

    //ver si tiene enfermedades con la dieta
    private function buscarDieta($perro, $etapa)
    {
        foreach ($perro->enfermedades as $registro) {
            //donde tiene enfermedad
            if ($registro->activa) {
                $dieta = Dieta::where('etapa_id', $etapa->id) //por cada enfermedad y registro
                    ->where('enfermedad_id', $registro->enfermedad_id)
                    //traer fila que encontro de etapa y de enfermedad hablando de dietas
                    ->first();
                if ($dieta) {
                    return $dieta;
                }
            }
        }
        //dieta donde no tenga enfermedad
        return Dieta::where('etapa_id', $etapa->id)
            ->whereNull('enfermedad_id')
            ->first();
    }

    private function calcularPorcion($perro, $dieta)
    {
        $porcion_diaria = (float)$perro->peso_kg * (float)$dieta->porcion_por_kg;
        //ya son números, no hace falta float
        $porcion_por_comida = $porcion_diaria / $dieta->comidas_dia;
        return round($porcion_por_comida, 2);
    }

    //ubicar las comidas segun la dieta
    private function ubicarComidas($user, $perrosQueComen, $fecha, $libres)
    {
        //cuantas veces come el perro que mas come
        $maxComidas = 0;
        foreach ($perrosQueComen as $c) {
            if ($c['comidas'] > $maxComidas) {
                $maxComidas = $c['comidas'];
            }
        }

        //comida fija mañana noche
        $manana = Carbon::parse($user->hora_levantarse)->addMinutes(30);
        $noche = Carbon::parse($user->hora_acostarse)->subMinutes(45);
        //si hay un maximo se restan 2 fijas
        $extras = max(0, $maxComidas - 2);
        //minutos entre mañana y noche
        $minutosEntre = $manana->diffInMinutes($noche);
        //cada cuando va uno extra
        $paso = $minutosEntre / ($extras + 1);

        //lista de comidas
        $listaComidas = [];
        //media hora que se levante y si o si 1 
        $listaComidas[] = ['hora' => $manana, 'minimo' => 1];
        for ($j = 1; $j <= $extras; $j++) {
            $listaComidas[] = [
                //con las variables de arriba
                'hora'   => $manana->copy()->addMinutes($paso * $j),
                'minimo' => 2 + $j,
            ];
        }
        $listaComidas[] = ['hora' => $noche, 'minimo' => 2];

        //guardar cada comida con los perros que aplican
        foreach ($listaComidas as $comida) {
            $horaComida = $comida['hora']->format('H:i:s');
            $alerta = $this->estaLibre($horaComida, $libres) ? null : 'Sin hueco libre: delegar o usar dispensador';

            //evento de comida
            $evento = $user->agenda()->create([
                'fecha'        => $fecha,
                'hora_inicio'  => $horaComida,
                'duracion_min' => 15,
                'tipo'         => 'comida',
                'alerta'       => $alerta,
            ]);
            //perros que aplican a la comida
            foreach ($perrosQueComen as $c) {
                //este perro come al menos las veces que pide esta comida
                if ($c['comidas'] >= $comida['minimo']) {
                    $evento->agendaperro()->create([
                        'perro_id'  => $c['perro']->id,
                        'porcion_g' => $c['porcion'],
                    ]);
                }
            }
        }
    }

    //convertir salidas en paseos
    private function convertirEnPaseos($candidatasPaseo, $metaPaseo, $perrosPaseo)
    {
        //ordenar de mayor a menr
        usort($candidatasPaseo, fn($a, $b) => $b['disponible'] <=> $a['disponible']);

        //lo que falta por pasear arranca en la meta
        $falta = $metaPaseo;

        //lo que falta a cada perro segun su raza
        $faltaPerro =[];
        foreach($perrosPaseo as $p){
            //anotamos lo que le falta a cada perro
            $faltaPerro[$p['perro']->id] = $p['meta'];
        }

        

        //repartir
        foreach ($candidatasPaseo as $c) {
            if ($falta <= 0) {
                break;
            }

            //lo que falta o lo que cabe, lo menor
            $minutos = min($falta, $c['disponible']); //sale de ubicarNecesidades

            //transformar la salida en paseo
            $c['evento']->update([
                'tipo' => 'paseo',
                'duracion_min' => $minutos,

            ]);

            foreach($perrosPaseo as $p){
                $id = $p['perro']->id;
                $minutosPerro = min($faltaPerro[$id],$minutos);
                //lo que falta a este perro, lo que dura este paseo para no caminar de mas

                $c['evento']->agendaperro()->where('perro_id', $id)->update([
                    'minutos_requeridos' => $minutosPerro,
                    'intensidad' => $p['intensidad'],
                ]);
                $faltaPerro[$id] = $faltaPerro[$id] - $minutosPerro;

            }

            //restar lo que ya asigne en cada vuelta
            $falta = $falta - $minutos;
        }
    }

    //resolver conflictos: borde, delegaciones, alternativas, alertas
    private function resolverConflicto() {}
}
