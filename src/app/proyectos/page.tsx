import { fetchProjectData } from '@/app/db/db';

export default async function Page() {
    //firstAttemptFunction().then(res => console.log(res.rows)); //conexión de BD
    const data = await fetchProjectData();
    const body = (<>{ data.map((row) => (<tr key={row.codigo}>
        <td>{row.codigo}</td>
        <td>{row.ip}</td>
        <td>{row.titulo}</td>
        <td>{row.financiado}</td>
        <td>{JSON.stringify(row.inicio)}</td>
        <td>{JSON.stringify(row.fin)}</td>
    </tr>)) } </>);
    return (<main>
        <h1>Proyectos</h1>
        <table>
            <thead>
            <tr>
                <th>Codigo</th>
                <th>Investigador Principal</th>
                <th>Titulo</th>
                <th>Financiado</th>
                <th>Inicio</th>
                <th>Fin</th>
            </tr>
            </thead>
            <tbody>
            {body}
            </tbody>
        </table>
    </main>);
}