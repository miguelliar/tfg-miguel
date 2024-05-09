import { fetchInvestigadorData, fetchProjectData } from '@/app/db/db';

export default async function Page() {
    //firstAttemptFunction().then(res => console.log(res.rows)); //conexión de BD
    const projectData = await fetchProjectData();

    const investigadorData = await fetchInvestigadorData();
      
    const proyectBody = (
        <>
            { 
                projectData && projectData.map((row) => (
                    <tr key={row.codigo}>
                        <td>{row.codigo}</td>
                        <td>{row.ip}</td>
                        <td>{row.titulo}</td>
                        <td>{row.financiado}</td>
                        <td>{JSON.stringify(row.inicio)}</td>
                        <td>{JSON.stringify(row.fin)}</td>
                    </tr>
                ))
            }
        </>
    );

    const investigadorBody = (
        <>
            {
                investigadorData && investigadorData.map((row) => (
                    <tr key={row.id}>
                        <td>{row.nombre_autor}</td>
                        <td>{row.universidad}</td>
                        <td>{row.departamento}</td>
                        <td>{row.area}</td>
                        <td>{row.figura}</td>
                        <td>{row.miembro}</td>
                    </tr>
                ))
            }
        </>
    )

    return (
    <main>
        <h1>Proyectos</h1>
        <section>
            <h2>Selecciona un proyecto</h2>
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
                {proyectBody}
                </tbody>
            </table>
        </section>
        <section>
            <h2>Investigadores involucrados en el proyecto</h2>
            <table>
                <thead>
                <tr>
                    <th>Nombre de autor</th>
                    <th>Universidad</th>
                    <th>Departamento</th>
                    <th>Area</th>
                    <th>Figura</th>
                    <th>Miembro</th>
                </tr>
                </thead>
                <tbody>
                    {investigadorBody}
                </tbody>
            </table>
        </section>
    </main>);
}