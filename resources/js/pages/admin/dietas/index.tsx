import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Etapa {
    id: number;
    nombre: string;
}

interface Enfermedad {
    id: number;
    nombre: string;
}

interface Dieta {
    id: number;
    etapa_id: number;
    enfermedad_id: number | null;
    comidas_dia: number;
    porcion_por_kg: string;
    recomendaciones: string | null;
    etapa: Etapa;
    enfermedad: Enfermedad | null;
}

export default function Index({ dietas }: { dietas: Dieta[] }) {
    return (
        <AppLayout>
            <Head title="Dietas" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dietas</h1>
                    <Link href={route('admin.dietas.create')}>Nueva dieta</Link>
                </div>

                {dietas.length === 0 ? (
                    <p>No hay dietas registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Etapa</th>
                                <th className="p-2">Enfermedad</th>
                                <th className="p-2">Comidas/día</th>
                                <th className="p-2">Porción (g/kg)</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dietas.map((dieta) => (
                                <tr key={dieta.id} className="border-b">
                                    <td className="p-2">{dieta.etapa.nombre}</td>
                                    <td className="p-2">{dieta.enfermedad?.nombre ?? 'Sano (sin enfermedad)'}</td>
                                    <td className="p-2">{dieta.comidas_dia}</td>
                                    <td className="p-2">{dieta.porcion_por_kg}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.dietas.edit', dieta.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.dietas.destroy', dieta.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta dieta?')}
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


