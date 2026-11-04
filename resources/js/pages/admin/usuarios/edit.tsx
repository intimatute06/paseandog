import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Usuario {
    id: number;
    name: string;
    email: string;
    rol: string;
    estado: string;
}

export default function Edit({ usuario }: { usuario: Usuario }) {
    const { data, setData, put, processing, errors } = useForm({
        name: usuario.name,
        email: usuario.email,
        estado: usuario.estado,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.usuarios.update', usuario.id));
    };

    return (
        <AppLayout>
            <Head title="Editar usuario" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Editar usuario</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Rol</Label>
                        <p className="text-sm">{usuario.rol === 'admin' ? 'Administrador' : 'Dueño'} (no se puede cambiar)</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="estado">Estado</Label>
                        <select id="estado" className="rounded-md border p-2" value={data.estado} onChange={(e) => setData('estado', e.target.value)}>
                            <option value="activo">Activo</option>
                            <option value="suspendido">Suspendido</option>
                        </select>
                        <InputError message={errors.estado} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.usuarios.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
