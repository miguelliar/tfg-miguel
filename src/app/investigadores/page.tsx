import { fetchInvestigadorData } from '../../../db/db';
import { InvestigadorTable } from '../ui/tables/InvestigadorTable';

export default async function Page() {

    const investigadorData = await fetchInvestigadorData();

    return (
    <main>
        <h1>Investigadores</h1>
        <section className='m-4 p-1 flex flex-col'>
            <InvestigadorTable investigadorData={investigadorData} />
        </section>
    </main>);
}