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
        tamano: '',
        nivel_energia: '',
        minutos_paseo_dia: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.razas.store'));
    };

    return (
        <AppLayout>
            <Head title="Nueva raza" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Nueva raza</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tamano">Tamaño</Label>
                        <Input id="tamano" value={data.tamano} onChange={(e) => setData('tamano', e.target.value)} />
                        <p className="text-muted-foreground text-sm">
                            Según el peso adulto típico: Pequeño (menos de 10 kg), Mediano (10 a 25 kg) o Grande (más de 25 kg).
                        </p>
                        <InputError message={errors.tamano} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nivel_energia">Nivel de energía</Label>
                        <Input id="nivel_energia" value={data.nivel_energia} onChange={(e) => setData('nivel_energia', e.target.value)} />
                        <p className="text-muted-foreground text-sm">Baja, Media o Alta.</p>
                        <InputError message={errors.nivel_energia} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="minutos_paseo_dia">Minutos del paseo del día</Label>
                        <Input
                            id="minutos_paseo_dia"
                            type="number"
                            value={data.minutos_paseo_dia}
                            onChange={(e) => setData('minutos_paseo_dia', e.target.value)}
                        />
                        <InputError message={errors.minutos_paseo_dia} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.razas.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
