import Link from 'next/link';
import { fetchFilteredInvestigador, fetchProjectData } from '../../../db/db';
import { InvestigadorTable } from '../ui/tables/InvestigadorTable';
import { ProjectTable } from '../ui/tables/ProjectTable';
import { AddInvestigadorAProyecto } from '../ui/AddInvestigadorAProyecto';

export default async function Page({
    searchParams
  }: {
    searchParams?: {
        projectId?: string;
    }
  }) {
    const projectData = await fetchProjectData();

    const investigadorData = await fetchFilteredInvestigador(searchParams?.projectId??'');

    return (
    <main>
        <h1>Proyectos</h1>
        <section>
            <Link href="/proyectos/crear">Crear proyecto</Link>
        </section>
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Selecciona un proyecto</h2>
            <ProjectTable projectData={projectData}/>
        </section>
        {
            searchParams?.projectId && (
                <AddInvestigadorAProyecto proyectoId={searchParams?.projectId}/>
            )
        }
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Investigadores involucrados en el proyecto</h2>
            <InvestigadorTable investigadorData={investigadorData} />
        </section>
    </main>);
}