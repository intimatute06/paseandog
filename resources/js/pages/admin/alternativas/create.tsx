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
        aplica_a: '',
        instrucciones: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.alternativas.store'));
    };

    return (
        <AppLayout>
            <Head title="Nueva alternativa" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Nueva alternativa</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="aplica_a">Aplica a</Label>
                        <select
                            id="aplica_a"
                            className="rounded-md border p-2"
                            value={data.aplica_a}
                            onChange={(e) => setData('aplica_a', e.target.value)}
                        >
                            <option value="">Elige para qué sirve</option>
                            <option value="necesidades">Necesidades</option>
                            <option value="comida">Comida</option>
                        </select>
                        <InputError message={errors.aplica_a} />
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
                        <Link href={route('admin.alternativas.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
