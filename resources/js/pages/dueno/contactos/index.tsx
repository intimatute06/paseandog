import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Contacto {
    id: number;
    nombre: string;
    relacion: string;
    telefono: string;
    predeterminado: boolean;
}

export default function Index({ contactos }: { contactos: Contacto[] }) {
    return (
        <AppLayout>
            <Head title="Mis contactos" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mis contactos</h1>
                    {contactos.length < 3 ? (
                        <Link href={route('dueno.contactos.create')}>Nuevo contacto</Link>
                    ) : (
                        <span className="cursor-not-allowed text-gray-400" title="Máximo 3 contactos">Nuevo contacto</span>
                    )}
                </div>
                {contactos.length === 0 ? (
                    <p>{"No hay contactos registrados"}</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Relación</th>
                                <th className='p-2'>Telefonó</th>
                                <th className='p-2'>Principal</th>
                                <th className='p-2'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactos.map((contacto) => (
                                <tr key={contacto.id} className="border-b">
                                    <td className='p-2'>{contacto.nombre}</td>
                                    <td className='p-2'>{contacto.relacion}</td>
                                    <td className='p-2'>{contacto.telefono}</td>
                                    <td className='p-2'>{contacto.predeterminado ? 'Principal': ''}</td>
                                    <td className='p-2'>
                                        <div className='flex gap-2'>
                                            <Link href={route('dueno.contactos.edit', contacto.id)}>Editar</Link>
                                            <Link
                                                href={route('dueno.contactos.destroy', contacto.id)}
                                                method='delete'
                                                as='button'
                                                onBefore={() => confirm('¿Seguro que quieres borrar a este contacto?')}
                                            >
                                                Borrar
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>

                )}
            </div>
        </AppLayout>
    )
}