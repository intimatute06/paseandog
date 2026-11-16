import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Contacto {
    id: number;
    nombre: string;
    relacion: string;
    telefono: string;
    predeterminado: boolean;
}

export default function Edit({ contacto }: { contacto: Contacto }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: contacto.nombre,
        relacion: contacto.relacion,
        telefono: contacto.telefono,
        predeterminado: contacto.predeterminado,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('dueno.contactos.update', contacto.id));
    }

    return (
        <AppLayout>
            <Head title='Editar contacto' />
            <div className="max-w-xl p-4">

                <form onSubmit={submit} className="flex flex-col gap-4">
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
                        <Button disabled={processing}>Guardar</Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    )


}