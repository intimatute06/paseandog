import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Alternativa {
    id: number;
    nombre: string;
    aplica_a: string;
    instrucciones: string;
}

const aplicaA: Record<string, string> = {
    necesidades: 'Necesidades',
    comida: 'Comida',
};

export default function Index({ alternativas }: { alternativas: Alternativa[] }) {
    return (
        <AppLayout>
            <Head title="Alternativas en casa" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Alternativas en casa</h1>
                    <Link href={route('admin.alternativas.create')}>Nueva alternativa</Link>
                </div>

                {alternativas.length === 0 ? (
                    <p>No hay alternativas registradas.</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Aplica a</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alternativas.map((alternativa) => (
                                <tr key={alternativa.id} className="border-b">
                                    <td className="p-2">{alternativa.nombre}</td>
                                    <td className="p-2">{aplicaA[alternativa.aplica_a] ?? alternativa.aplica_a}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link href={route('admin.alternativas.edit', alternativa.id)}>Editar</Link>
                                            <Link
                                                href={route('admin.alternativas.destroy', alternativa.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Seguro que quieres borrar esta alternativa?')}
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
