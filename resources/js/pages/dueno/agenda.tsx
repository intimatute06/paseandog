import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface AgendaPerro {
    id: number;
    estado: string;
    minutos_requeridos: number | null;   // solo en paseos
    porcion_g: string | null;            // solo en comidas (decimal llega como texto)
    perro: { nombre: string };           // viene del with
    intensidad: string | null;   // solo en paseos
}
interface Evento {
    id: number;
    fecha: string;
    hora_inicio: string;
    duracion_min: number;
    tipo: string;
    alerta: string | null;
    agendaperro: AgendaPerro[];          // viene del with('agendaperro...')
}

export default function Agenda({ eventos }: { eventos: Evento[] }) {
    // los días que hay en la agenda, sin repetir
    const dias = [...new Set(eventos.map((e) => e.fecha.slice(0, 10)))];
    // el día elegido en las pestañas (arranca en el primero)
    const [diaElegido, setDiaElegido] = useState(dias[0]);
    // solo los eventos de ese día
    const eventosDelDia = eventos.filter((e) => e.fecha.slice(0, 10) === diaElegido);
    return (
        <AppLayout>
            <Head title="Mi agenda" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mi agenda</h1>
                    <Link href={route('dueno.agenda.generar')} method="post" as="button">
                        Generar agenda
                    </Link>
                </div>
            
                <div className="mb-4 flex gap-2 border-b">
                    {dias.map((dia) => (
                        <button
                            key={dia}
                            onClick={() => setDiaElegido(dia)}
                            className={`px-3 py-2 capitalize ${dia === diaElegido ? 'border-b-2 border-current font-bold' : 'opacity-60'}`}
                        >
                            {new Date(dia + 'T00:00').toLocaleDateString('es', { weekday: 'short', day: 'numeric' })}
                        </button>
                    ))}
                </div>

       {eventos.length === 0 ? (
                    <p>No hay agendas registradas</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Hora</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2">Duración</th>
                                <th className="p-2">Perros</th>
                                <th className="p-2">Alerta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventosDelDia.map((evento) => (
                                <tr key={evento.id} className="border-b">

                                    <td className="p-2">{evento.hora_inicio.slice(0, 5)}</td>
                                    <td className="p-2 capitalize">{evento.tipo}</td>
                                    <td className="p-2">{evento.duracion_min} min</td>
                                    <td className="p-2">



                                        {evento.agendaperro.map((ap) => (
                                            <div key={ap.id}>
                                                {ap.perro.nombre} · {ap.estado}{ap.porcion_g ? ` · ${ap.porcion_g} g` : ''}
                                                {ap.minutos_requeridos ? ` · ${ap.minutos_requeridos} min (${ap.intensidad})` : ''}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-2">
                                        {evento.alerta ? evento.alerta : '-'}

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AppLayout>
    );

}
