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
        edad_min_meses: '',
        edad_max_meses: '',
        intervalo_max_horas: '',
        salidas_min_dia: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.etapas.store'));
    };

    return (
        <AppLayout>
            <Head title="Nueva etapa" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Nueva etapa</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edad_min_meses">Edad mínima (meses)</Label>
                        <Input
                            id="edad_min_meses"
                            type="number"
                            value={data.edad_min_meses}
                            onChange={(e) => setData('edad_min_meses', e.target.value)}
                        />
                        <InputError message={errors.edad_min_meses} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edad_max_meses">Edad máxima (meses)</Label>
                        <Input
                            id="edad_max_meses"
                            type="number"
                            value={data.edad_max_meses}
                            onChange={(e) => setData('edad_max_meses', e.target.value)}
                        />
                        <InputError message={errors.edad_max_meses} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="intervalo_max_horas">Intervalo máximo entre salidas (horas)</Label>
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
                        <Label htmlFor="salidas_min_dia">Salidas mínimas al día</Label>
                        <Input
                            id="salidas_min_dia"
                            type="number"
                            value={data.salidas_min_dia}
                            onChange={(e) => setData('salidas_min_dia', e.target.value)}
                        />
                        <InputError message={errors.salidas_min_dia} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.etapas.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}