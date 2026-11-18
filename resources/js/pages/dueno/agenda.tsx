import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface AgendaPerro {
    id: number;
    estado: string;
    minutos_requeridos: number | null;   // solo en paseos
    porcion_g: string | null;            // solo en comidas (decimal llega como texto)
    perro: { nombre: string };           // viene del with
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
                
                {eventos.length === 0 ? (
                    <p>No hay agendas registradas</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Fecha</th>
                                <th className="p-2">Hora</th>
                                <th className="p-2">Tipo</th>
                                 <th className="p-2">Perros</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map((evento) => (
                                <tr key={evento.id} className="border-b">
                                    
                                     <td className="p-2">{evento.fecha.slice(0,10)}</td>
                                        <td className="p-2">{evento.hora_inicio.slice(0,5)}</td>
                                        <td className="p-2">{evento.tipo}</td>
                                    <td className="p-2">
                                       
                                       
                                        
                                        {evento.agendaperro.map((ap) => (
                                            <div key={ap.id}>{ap.perro.nombre} · {ap.estado}</div>
                                        ))}
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