import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Enfermedad {
    id: number;
    nombre: string;
    descripcion: string | null;
    intensidad_max: string | null;
    intervalo_max_horas: string | null;
    restriccion_alimentaria: string | null;
}

export default function Index({ enfermedades }: { enfermedades: Enfermedad[] }) {
    return (
        <AppLayout>
            <Head title="Enfermedades" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enfermedades</h1>
                    <Link href={route('admin.enfermedades.create')}>Nueva enfermedad</Link>
                </div>

                {enfermedades.length === 0 ? (
                    <p>No hay enfermedades registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Intensidad máx.</th>
                                <th className="p-2">Intervalo máx. (horas)</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enfermedades.map((enfermedad) => (
                                <tr key={enfermedad.id} className="border-b">
                                    <td className="p-2">{enfermedad.nombre}</td>
                                    <td className="p-2">{enfermedad.intensidad_max ?? '—'}</td>
                                    <td className="p-2">{enfermedad.intervalo_max_horas ?? '—'}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.enfermedades.edit', enfermedad.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.enfermedades.destroy', enfermedad.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta enfermedad?')}
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
