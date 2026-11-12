import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';


interface Opcion {
    id: number;
    nombre: string;
}


interface Registro {
    id: number;
    enfermedad_id: number;
    activa: boolean;
    enfermedad: { nombre: string };
}


interface Props {
    perro: { id: number; nombre: string };
    registros: Registro[];
    enfermedades: Opcion[];
}

export default function Enfermedades({ perro, registros, enfermedades }: Props) {

    const { data, setData, post, processing, errors, reset } = useForm({
        enfermedad_id: '',
    });

  
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dueno.perros.enfermedades.store', perro.id), {
            onSuccess: () => reset(),
        });
    };

    // solo las enfermedades que este perro todavía no tiene
    const disponibles = enfermedades.filter((enf) => !registros.some((r) => r.enfermedad_id === enf.id));

    return (
        <AppLayout>
            <Head title={`Enfermedades de ${perro.nombre}`} />
            <div className="max-w-2xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Enfermedades de {perro.nombre}</h1>

                {registros.length === 0 ? (
                    <p className="mb-6">No hay enfermedades registradas.</p>
                ) : (
                    <table className="mb-6 w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Enfermedad</th>
                                <th className="p-2">Estado</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((registro) => (
                                <tr key={registro.id} className="border-b">
                                    <td className="p-2">{registro.enfermedad.nombre}</td>
                                    <td className="p-2">{registro.activa ? 'Activa' : 'Inactiva'}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('dueno.perros.enfermedades.update', [perro.id, registro.id])}
                                                method="put"
                                                as="button"
                                            >
                                                {registro.activa ? 'Desactivar' : 'Activar'}
                                            </Link>
                                            <Link
                                                href={route('dueno.perros.enfermedades.destroy', [perro.id, registro.id])}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Quitar esta enfermedad?')}
                                            >
                                                Quitar
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

             
                <form onSubmit={submit} className="flex items-end gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="enfermedad_id">Agregar enfermedad</Label>
                        <select
                            id="enfermedad_id"
                            className="rounded-md border p-2"
                            value={data.enfermedad_id}
                            onChange={(e) => setData('enfermedad_id', e.target.value)}
                        >
                            <option value="">Elige una enfermedad</option>
                            {disponibles.map((enf) => (
                                <option key={enf.id} value={enf.id}>
                                    {enf.nombre}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.enfermedad_id} />
                    </div>
                    <Button disabled={processing}>Agregar</Button>
                </form>
            </div>
        </AppLayout>
    );
}
