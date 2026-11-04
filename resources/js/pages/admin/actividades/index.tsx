import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Actividad {
    id: number;
    nombre: string;
    tipo: string;
    duracion_min: number;
    intensidad: string;
    factor_equivalencia: string;
    instrucciones: string;
}

const tipos: Record<string, string> = {
    mental: 'Mental',
    en_casa: 'En casa',
};

export default function Index({ actividades }: { actividades: Actividad[] }) {
    return (
        <AppLayout>
            <Head title="Actividades de compensación" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Actividades de compensación</h1>
                    <Link href={route('admin.actividades.create')}>Nueva actividad</Link>
                </div>

                {actividades.length === 0 ? (
                    <p>No hay actividades registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2">Duración (min)</th>
                                <th className="p-2">Intensidad</th>
                                <th className="p-2">Factor</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {actividades.map((actividad) => (
                                <tr key={actividad.id} className="border-b">
                                    <td className="p-2">{actividad.nombre}</td>
                                    <td className="p-2">{tipos[actividad.tipo] ?? actividad.tipo}</td>
                                    <td className="p-2">{actividad.duracion_min}</td>
                                    <td className="p-2">{actividad.intensidad}</td>
                                    <td className="p-2">{actividad.factor_equivalencia}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.actividades.edit', actividad.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.actividades.destroy', actividad.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta actividad?')}
                                            >
                                                Borrar
                                            </Link>
                                        </div>
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
