import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Usuario {
    id: number;
    name: string;
    email: string;
    rol: string;
    estado: string;
}

const roles: Record<string, string> = {
    admin: 'Administrador',
    dueno: 'Dueño',
};

export default function Index({ usuarios }: { usuarios: Usuario[] }) {
    return (
        <AppLayout>
            <Head title="Usuarios" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Usuarios</h1>

                {usuarios.length === 0 ? (
                    <p>No hay usuarios registrados.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Rol</th>
                                <th className="p-2">Estado</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b">
                                    <td className="p-2">{usuario.name}</td>
                                    <td className="p-2">{usuario.email}</td>
                                    <td className="p-2">{roles[usuario.rol] ?? usuario.rol}</td>
                                    <td className="p-2">
                                        <span className={usuario.estado === 'activo' ? 'text-green-600' : 'text-red-600'}>
                                            {usuario.estado === 'activo' ? 'Activo' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <Link href={route('admin.usuarios.edit', usuario.id)}>Editar</Link>
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
