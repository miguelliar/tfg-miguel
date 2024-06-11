import { fetchInvestigadorData, fetchProjectData } from '../../../db/db';
import { InvestigadorTable } from '../ui/InvestigadorTable';
import { ProjectTable } from '../ui/ProjectTable';

export default async function Page() {
    const projectData = await fetchProjectData();

    const investigadorData = await fetchInvestigadorData();

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