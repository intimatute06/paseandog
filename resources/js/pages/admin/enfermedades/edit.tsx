import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Enfermedad {
    id: number;
    nombre: string;
    descripcion: string | null;
    intensidad_max: string | null;
    intervalo_max_horas: string | null;
    restriccion_alimentaria: string | null;
}

export default function Edit({ enfermedad }: { enfermedad: Enfermedad }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: enfermedad.nombre,
        descripcion: enfermedad.descripcion ?? '',
        intensidad_max: enfermedad.intensidad_max ?? '',
        intervalo_max_horas: enfermedad.intervalo_max_horas ?? '',
        restriccion_alimentaria: enfermedad.restriccion_alimentaria ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.enfermedades.update', enfermedad.id));
    };

    return (
        <AppLayout>
            <Head title="Editar enfermedad" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Editar enfermedad</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="descripcion">Descripción (opcional)</Label>
                        <textarea
                            id="descripcion"
                            className="rounded-md border p-2"
                            rows={3}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />
                        <InputError message={errors.descripcion} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="intensidad_max">Intensidad máxima</Label>
                        <select
                            id="intensidad_max"
                            className="rounded-md border p-2"
                            value={data.intensidad_max}
                            onChange={(e) => setData('intensidad_max', e.target.value)}
                        >
                            <option value="">Sin límite</option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                        <InputError message={errors.intensidad_max} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="intervalo_max_horas">Intervalo máximo entre salidas (horas, opcional)</Label>
                        <Input
                            id="intervalo_max_horas"
                            type="number"
                            step="0.5"
                            value={data.intervalo_max_horas}
                            onChange={(e) => setData('intervalo_max_horas', e.target.value)}
                        />
                        <InputError message={errors.intervalo_max_horas} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="restriccion_alimentaria">Restricción alimentaria (opcional)</Label>
                        <textarea
                            id="restriccion_alimentaria"
                            className="rounded-md border p-2"
                            rows={3}
                            value={data.restriccion_alimentaria}
                            onChange={(e) => setData('restriccion_alimentaria', e.target.value)}
                        />
                        <InputError message={errors.restriccion_alimentaria} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.enfermedades.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
