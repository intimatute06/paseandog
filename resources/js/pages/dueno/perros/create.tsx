import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Raza {
    id: number;
    nombre: string;
}

export default function Create({ razas }: { razas: Raza[] }) {
    // recibe las razas que manda PerroController@create
    const { data, setData, post, processing, errors } = useForm({
        // la "caja" del formulario: guarda lo que escribe el usuario
        raza_id: '',
        nombre: '',
        fecha_nacimiento: '',
        peso_kg: '',

    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('dueno.perros.store'));
    };
    //se ejecuta al darle guardar frena que se recarge la pagina 

    return (
        <AppLayout>
            <Head title="Nuevo perro" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Nuevo perro</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">

                        <Label htmlFor='raza_id'>Raza</Label>
                        <select id="raza_id"
                            className='rounded-md border p-2'
                            value={data.raza_id}
                            onChange={(e) => setData('raza_id', e.target.value)}
                        >
                            <option value="">Elige una raza</option>
                            {razas.map((raza) => (
                                <option key={raza.id} value={raza.id}>{raza.nombre}</option>
                            )
                            )}
                        </select>
                        <InputError message={errors.raza_id} />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='nombre'>Nombre</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)} />
                        <InputError message={errors.nombre} />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='fecha_nacimiento'>Fecha de Nacimiento</Label>
                        <Input
                            id="fecha_nacimiento"
                            value={data.fecha_nacimiento}
                            type='date'
                            onChange={(e) => setData('fecha_nacimiento', e.target.value)} />
                        <InputError message={errors.fecha_nacimiento} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="peso_kg">Peso (kg)</Label>
                        <Input
                            id="peso_kg"
                            type="number"
                            step="0.01"
                            value={data.peso_kg}
                            onChange={(e) => setData('peso_kg', e.target.value)}
                        />
                        <InputError message={errors.peso_kg} />
                    </div>
                    <InputError message={(errors as Record<string, string>).limite} />
                    <Button disabled={processing}>Guardar</Button>
                    
                </form>
                
            </div>
            
        </AppLayout>
    );


}