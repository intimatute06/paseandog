import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

interface Etapa {
    id: number;
    nombre: string;
    edad_min_meses: number;
    edad_max_meses: number;
    intervalo_max_horas: string;
    salidas_min_dia: number;
}

export default function Index({ etapas }: { etapas: Etapa[] }) {
    const { errors } = usePage().props;
    return (
        <AppLayout>
            <Head title="Etapas" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Etapas</h1>
                    <Link href={route('admin.etapas.create')}>Nueva etapa</Link>
                </div>
                {errors.borrar && <p className="mb-4 text-red-600">{errors.borrar}</p>}
                {etapas.length === 0 ? (
                    <p>No hay etapas registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Edad mínima (meses)</th>
                                <th className="p-2">Edad máxima (meses)</th>
                                <th className="p-2">Intervalo máx. (horas)</th>
                                <th className="p-2">Salidas mín./día</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etapas.map((etapa) => (
                                <tr key={etapa.id} className="border-b">
                                    <td className="p-2">{etapa.nombre}</td>
                                    <td className="p-2">{etapa.edad_min_meses}</td>
                                    <td className="p-2">{etapa.edad_max_meses}</td>
                                    <td className="p-2">{etapa.intervalo_max_horas}</td>
                                    <td className="p-2">{etapa.salidas_min_dia}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.etapas.edit', etapa.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.etapas.destroy', etapa.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta etapa?')}
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
