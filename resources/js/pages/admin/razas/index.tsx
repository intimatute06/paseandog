import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Raza {
    id: number;
    nombre: string;
    tamano: string;
    nivel_energia: string;
    minutos_paseo_dia: number;
}

export default function Index({ razas }: { razas: Raza[] }) {
    return (
        <AppLayout>
            <Head title="Razas" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Razas</h1>
                    <Link href={route('admin.razas.create')}>Nueva Raza</Link>
                </div>

                {razas.length === 0 ? (
                    <p>No hay razas registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Tamaño</th>
                                <th className="p-2">Energía</th>
                                <th className="p-2">Minutos de paseo</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {razas.map((raza) => (
                                <tr key={raza.id} className="border-b">
                                    <td className="p-2">{raza.nombre}</td>
                                    <td className="p-2">{raza.tamano}</td>
                                    <td className="p-2">{raza.nivel_energia}</td>
                                    <td className="p-2">{raza.minutos_paseo_dia}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.razas.edit', raza.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.razas.destroy', raza.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta raza?')}
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
