import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Opcion {
    id: number;
    nombre: string;
}

interface Existente {
    etapa_id: number;
    enfermedad_id: number | null;
}

interface Dieta {
    id: number;
    etapa_id: number;
    enfermedad_id: number | null;
    comidas_dia: number;
    porcion_por_kg: string;
    recomendaciones: string | null;
}

interface Props {
    dieta: Dieta;
    etapas: Opcion[];
    enfermedades: Opcion[];
    existentes: Existente[];
}

export default function Edit({ dieta, etapas, enfermedades, existentes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        etapa_id: String(dieta.etapa_id),
        enfermedad_id: dieta.enfermedad_id ? String(dieta.enfermedad_id) : '',
        comidas_dia: String(dieta.comidas_dia),
        porcion_por_kg: dieta.porcion_por_kg,
        recomendaciones: dieta.recomendaciones ?? '',
    });

    const etapaElegida = Number(data.etapa_id);

    const sanaYaExiste = existentes.some((d) => d.etapa_id === etapaElegida && d.enfermedad_id === null);

    const enfermedadesDisponibles = enfermedades.filter((enf) => !existentes.some((d) => d.etapa_id === etapaElegida && d.enfermedad_id === enf.id));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.dietas.update', dieta.id));
    };

    return (
        <AppLayout>
            <Head title="Editar dieta" />
            <div className="max-w-xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Editar dieta</h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="etapa_id">Etapa</Label>
                        <select
                            id="etapa_id"
                            className="rounded-md border p-2"
                            value={data.etapa_id}
                            onChange={(e) => setData({ ...data, etapa_id: e.target.value, enfermedad_id: '' })}
                        >
                            <option value="">Elige una etapa</option>
                            {etapas.map((etapa) => (
                                <option key={etapa.id} value={etapa.id}>
                                    {etapa.nombre}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.etapa_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="enfermedad_id">Enfermedad</Label>
                        <select
                            id="enfermedad_id"
                            className="rounded-md border p-2"
                            value={data.enfermedad_id}
                            onChange={(e) => setData('enfermedad_id', e.target.value)}
                            disabled={data.etapa_id === ''}
                        >
                            {!sanaYaExiste && <option value="">Sin enfermedad (perro sano)</option>}
                            {sanaYaExiste && <option value="">Elige una enfermedad</option>}
                            {enfermedadesDisponibles.map((enf) => (
                                <option key={enf.id} value={enf.id}>
                                    {enf.nombre}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.enfermedad_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="comidas_dia">Comidas al día</Label>
                        <Input id="comidas_dia" type="number" value={data.comidas_dia} onChange={(e) => setData('comidas_dia', e.target.value)} />
                        <InputError message={errors.comidas_dia} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="porcion_por_kg">Porción por kg de peso (gramos)</Label>
                        <Input
                            id="porcion_por_kg"
                            type="number"
                            step="0.01"
                            value={data.porcion_por_kg}
                            onChange={(e) => setData('porcion_por_kg', e.target.value)}
                        />
                        <InputError message={errors.porcion_por_kg} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="recomendaciones">Recomendaciones (opcional)</Label>
                        <textarea
                            id="recomendaciones"
                            className="rounded-md border p-2"
                            rows={3}
                            value={data.recomendaciones}
                            onChange={(e) => setData('recomendaciones', e.target.value)}
                        />
                        <InputError message={errors.recomendaciones} />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Link href={route('admin.dietas.index')}>Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
