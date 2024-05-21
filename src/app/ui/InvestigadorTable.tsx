
export const InvestigadorTable = (
    {investigadorData,}: {investigadorData?: any[]}
) => {
return (
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
    </tbody>
</table>
)}