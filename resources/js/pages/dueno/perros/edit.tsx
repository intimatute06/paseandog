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

interface Perro {
    id: number;
    raza_id: number;
  
    nombre: string;
    fecha_nacimiento: string;
    peso_kg: string;
}

interface Props {
    razas: Raza[];
    perro: Perro;
    
}

export default function Edit({ razas, perro }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        raza_id: String(perro.raza_id),
        nombre: perro.nombre,
        fecha_nacimiento: perro.fecha_nacimiento.slice(0, 10),
        peso_kg: perro.peso_kg,


    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('dueno.perros.update', perro.id));
    }

    return (
        <AppLayout>
            <Head title="Editar perro" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Editar perro</h1>

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
                    <Button disabled={processing}>Guardar</Button>
                </form>
            </div>
        </AppLayout>
    );
}