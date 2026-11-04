import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        tipo: '',
        duracion_min: '',
        intensidad: '',
        factor_equivalencia: '',
        instrucciones: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.actividades.store'));
    };

    return (
        <AppLayout>
            <Head title="Nueva actividad" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Nueva actividad</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <select id="tipo" className="rounded-md border p-2" value={data.tipo} onChange={(e) => setData('tipo', e.target.value)}>
                            <option value="">Elige un tipo</option>
                            <option value="mental">Mental</option>
                            <option value="en_casa">En casa</option>
                        </select>
                        <InputError message={errors.tipo} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="duracion_min">Duración (minutos)</Label>
                        <Input id="duracion_min" type="number" value={data.duracion_min} onChange={(e) => setData('duracion_min', e.target.value)} />
                        <InputError message={errors.duracion_min} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="intensidad">Intensidad</Label>
                        <select
                            id="intensidad"
                            className="rounded-md border p-2"
                            value={data.intensidad}
                            onChange={(e) => setData('intensidad', e.target.value)}
                        >
                            <option value="">Elige una intensidad</option>
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                        <InputError message={errors.intensidad} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="factor_equivalencia">Factor de equivalencia</Label>
                        <Input
                            id="factor_equivalencia"
                            type="number"
                            step="0.1"
                            value={data.factor_equivalencia}
                            onChange={(e) => setData('factor_equivalencia', e.target.value)}
                        />
                        <InputError message={errors.factor_equivalencia} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="instrucciones">Instrucciones</Label>
                        <textarea
                            id="instrucciones"
                            className="rounded-md border p-2"
                            rows={4}
                            value={data.instrucciones}
                            onChange={(e) => setData('instrucciones', e.target.value)}
                        />
                        <InputError message={errors.instrucciones} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.actividades.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
