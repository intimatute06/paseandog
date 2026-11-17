import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Alternativa{
    id:number;
    nombre:string;
    aplica_a:string;
}

interface Props{
    alternativas: Alternativa[]; //lista de alternativas completas del controller
    marcadas: number[];// el id 
}

export default function Alternativas ({alternativas, marcadas}: Props){
    const { data, setData, put, processing} = useForm({
        //primero para que el usuario pueda ver las marcadas
        alternativas:marcadas,
    });
    const guardaralternativas: FormEventHandler = (e) => {
        e.preventDefault();
        // la lista no es formulario no tiene const 
        put(route('dueno.alternativas.guardar'));
    }

    return (
        <AppLayout>
            <Head title="Mis Alternativas"/>
            <div className="max-w-2xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Mis alternativas</h1>
                <form onSubmit={guardaralternativas} className="flex flex-col gap-3">
                    {alternativas.map((alt) => (
                        <label key={alt.id} className="flex items-center gap-2">
                            <input type="checkbox"
                            checked={data.alternativas.includes(alt.id)}
                            onChange={(e)=>
                                setData('alternativas', e.target.checked
                                    ?[...data.alternativas, alt.id]
                                    : data.alternativas.filter((id) => id !== alt.id)
                                )
                            } />
                            {alt.nombre}<span className="text-sm text-gray-500">({alt.aplica_a})</span>
                        </label>
                    ))}
                    <Button disabled={processing} className="w-fit">Guardar</Button>

                </form>
            </div>
        </AppLayout>
    )

}

