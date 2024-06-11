import { useState } from 'react';
import { fetchFilteredInvestigador, fetchInvestigadorData, fetchProjectData } from '../../../db/db';
import { InvestigadorTable } from '../ui/tables/InvestigadorTable';
import { ProjectTable } from '../ui/tables/ProjectTable';

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
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Selecciona un proyecto</h2>
            {/*<form onSubmit={(formEvent) => console.log(formEvent)}>
                <fieldset>
                    <button type='submit'>Buscar investigadores</button>
                </fieldset>
            </form>*/}
            <ProjectTable projectData={projectData}/>
        </section>
        <section className='m-4 p-1 flex flex-col'>
            <h2 className='text-lg'>Investigadores involucrados en el proyecto</h2>
            <InvestigadorTable investigadorData={investigadorData} />
        </section>
    </main>);
}