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
        relacion: '',
        telefono: '',
        predeterminado: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dueno.contactos.store'))
    };

    return (
        <AppLayout>
            <Head title='Nuevo Contacto' />
            <div className='max-w-xl p-4'>
                <h1 className='mb-4 text-2xl font-bold'>Nuevo contacto</h1>

                <form onSubmit={submit} className='flex flex-col gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='nombre'>Nombre</Label>
                        <Input
                            id='nombre'
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}></Input>
                        <InputError message={errors.nombre} />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='relacion'>Relación</Label>
                        <Input
                            id='relacion'
                            value={data.relacion}
                            onChange={(e) => setData('relacion', e.target.value)}></Input>
                        <InputError message={errors.relacion} />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='telefono'>Teléfono</Label>
                        <Input
                            id='telefono'
                            type='tel'
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}></Input>
                        <InputError message={errors.telefono} />
                    </div>
                    <div className='grid gap-2'>
                        <label className='flex items-center gap-2'>

                            <input type="checkbox" checked={data.predeterminado}
                                onChange={(e) => setData('predeterminado', e.target.checked)} />
                            Contacto principal
                        </label>
                        <InputError message={(errors as Record<string, string>).limite} />
                        <Button disabled={processing}>Guardar</Button>
                    </div>

                </form>
            </div>

        </AppLayout>
    )
}