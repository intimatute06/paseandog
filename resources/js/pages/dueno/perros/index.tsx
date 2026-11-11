import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Perro {
    id: number;
    nombre: string;
    fecha_nacimiento: string;
    peso_kg: string;
    raza: { nombre: string };
}

export default function Index({ perros }: { perros: Perro[] }) {
    return (
        <AppLayout>
            <Head title="Mis perros" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mis Perros</h1>
                    {perros.length < 2 ? (
                        <Link href={route('dueno.perros.create')}>Nuevo perro</Link>
                    ) : (
                        <span className="cursor-not-allowed text-gray-400" title="Máximo 2 perros">
                            Nuevo perro
                        </span>
                    )}
                </div>
                {perros.length === 0 ? (
                    <p>{"No hay Perros Registrados"}</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Raza</th>
                                <th className='p-2'>Fecha de nacimiento</th>
                                <th className='p-2'>Peso (en kilogramo)</th>
                                <th className="p-2">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {perros.map((perro) => (
                                <tr key={perro.id} className="border-b">
                                    <td className='p-2'>{perro.nombre}</td>
                                    <td className='p-2'>{perro.raza.nombre}</td>
                                    <td className='p-2'>{perro.fecha_nacimiento.slice(0, 10)}</td>
                                    <td className='p-2'>{perro.peso_kg}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">

                                            <Link href={route('dueno.perros.edit', perro.id)}>Editar</Link>
                                            <Link
                                                href={route('dueno.perros.destroy', perro.id)}
                                                method='delete'
                                                as='button'
                                                onBefore={() => confirm('¿Seguro que quieres borrar a este perro')}
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
    )
}