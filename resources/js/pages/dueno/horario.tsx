import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Bloque {
    id: number;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
    tipo: string;
}

interface Props {
    usuario: { hora_levantarse: string | null; hora_acostarse: string | null };
    bloques: Bloque[];
}

const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function Horario({ usuario, bloques }: Props) {
    const horas = useForm({
        hora_levantarse: usuario.hora_levantarse?.slice(0, 5) ?? '',
        hora_acostarse: usuario.hora_acostarse?.slice(0, 5) ?? '',
    });
    const bloque = useForm({
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        tipo: '',
    });

    const guardarHoras: FormEventHandler = (e) => {
        e.preventDefault();
        horas.put(route('dueno.horario.horas'));
    }

    const agregarBloques: FormEventHandler = (e) => {
        e.preventDefault();
        bloque.post(route('dueno.horario.store'), {
            onSuccess: () => bloque.reset(),
        });
    }
    return (
        <AppLayout>
            <Head title="Mi horario" />
            <div className="max-w-2xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Mi horario</h1>


                <form onSubmit={guardarHoras} className="mb-8 flex items-end gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="hora_levantarse">Me levanto</Label>
                        <Input
                            id="hora_levantarse"
                            type="time"
                            value={horas.data.hora_levantarse}
                            onChange={(e) => horas.setData('hora_levantarse', e.target.value)}
                        />
                        <InputError message={horas.errors.hora_levantarse} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="hora_acostarse">Me acuesto</Label>
                        <Input
                            id="hora_acostarse"
                            type="time"
                            value={horas.data.hora_acostarse}
                            onChange={(e) => horas.setData('hora_acostarse', e.target.value)}
                        />
                        <InputError message={horas.errors.hora_acostarse} />

                    </div>
                    <Button disabled={horas.processing}>Guardar</Button>
                </form>
                <h2 className="mb-2 text-xl font-bold">Bloques ocupados</h2>

                {bloques.length === 0 ? (
                    <p className="mb-6">Todavía no tienes bloques ocupados.</p>
                ) : (
                    <div className="mb-8 flex flex-col gap-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((dia) => {
                            const delDia = bloques.filter((b) => b.dia_semana === dia);
                            if (delDia.length === 0) return null;

                            return (
                                <div key={dia}>
                                    <h3 className="font-bold">{DIAS[dia]}</h3>
                                    {delDia.map((b) => (
                                        <div key={b.id} className="flex items-center gap-4 border-b py-1">
                                            <span>{b.hora_inicio.slice(0, 5)} – {b.hora_fin.slice(0, 5)}</span>
                                            <span>{b.tipo}</span>
                                            <Link
                                                href={route('dueno.horario.destroy', b.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('¿Quitar este bloque?')}
                                            >
                                                Quitar
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
                <h2 className="mb-2 text-xl font-bold">Agregar bloque ocupado</h2>

                <form onSubmit={agregarBloques} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="dia_semana">Día</Label>
                        <select
                            id="dia_semana"
                            className="rounded-md border p-2"
                            value={bloque.data.dia_semana}
                            onChange={(e) => bloque.setData('dia_semana', e.target.value)}
                        >
                            <option value="">Elige un día</option>
                            {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                                <option key={dia} value={dia}>
                                    {DIAS[dia]}
                                </option>
                            ))}
                        </select>
                        <InputError message={bloque.errors.dia_semana} />
                    </div>


                    <div className="flex gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="hora_inicio">Desde</Label>
                            <Input
                                id="hora_inicio"
                                type="time"
                                value={bloque.data.hora_inicio}
                                onChange={(e) => bloque.setData('hora_inicio', e.target.value)}
                            />
                            <InputError message={bloque.errors.hora_inicio} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hora_fin">Hasta</Label>
                            <Input
                                id="hora_fin"
                                type="time"
                                value={bloque.data.hora_fin}
                                onChange={(e) => bloque.setData('hora_fin', e.target.value)}
                            />
                            <InputError message={bloque.errors.hora_fin} />

                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <select
                            id="tipo"
                            className="rounded-md border p-2"
                            value={bloque.data.tipo}
                            onChange={(e) => bloque.setData('tipo', e.target.value)}
                        >
                            <option value="">Elige un tipo</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="estudio">Estudio</option>
                            <option value="otro">Otro</option>
                        </select>
                        <InputError message={bloque.errors.tipo} />
                    </div>

                    <Button disabled={bloque.processing}>Agregar bloque</Button>
                </form>
            </div>
        </AppLayout>
    );
}