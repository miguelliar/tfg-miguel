import Link from 'next/link';
import { InvestigadorTable } from '../ui/tables/InvestigadorTable';
import { ProjectTable } from '../ui/tables/ProjectTable';
import { AddInvestigadorAProyecto } from '../ui/AddInvestigadorAProyecto';
import { fetchProyectoData } from '../../../db/tables/proyecto';
import { fetchInvestigadorByProyectoCode } from '../../../db/tables/investigador';

export default async function Page({
    searchParams
  }: {
    searchParams?: {
        codigo?: string;
    }
  }) {
    const projectData = await fetchProyectoData();

    const investigadorData = await fetchInvestigadorByProyectoCode(searchParams?.codigo??'');

    return (
    <main>
        <h1>Proyectos</h1>
        <section>
            <Link href="/proyectos/crear">Añadir proyecto</Link>
        </section>
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Selecciona un proyecto</h2>
            <ProjectTable projectData={projectData}/>
        </section>
        {
            searchParams?.codigo && (
                <AddInvestigadorAProyecto codigo={searchParams?.codigo}/>
            )
        }
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Investigadores involucrados en el proyecto</h2>
            <InvestigadorTable investigadorData={investigadorData} />
        </section>
    </main>);
}