import { ProyectoType } from "../../../db/db"
import './tableStyle.css'

export const ProjectTable = (
{
    projectData,
} : {
    projectData? : ProyectoType[],
}) => {
    return (
    <table className="ProyectoTable">
        <thead>
            <tr className="ProyectoTableHeadRow">
                {/*<th>Selección</th>*/}
                <th>Codigo</th>
                <th>Investigador Principal</th>
                <th>Titulo</th>
                <th>Financiado</th>
                <th>Inicio</th>
                <th>Fin</th>
            </tr>
        </thead>
        <tbody className="ProyectoTableBody">
            { 
                projectData && projectData.map((row) => (
                    <tr key={row.codigo} className="ProyectoTableRow">
                        {/*<td><input type="radio" id={row.codigo} name="proyecto" value={row.codigo}></input></td>*/}
                        <td>{row.codigo}</td>
                        <td>{row.ip}</td>
                        <td>{row.titulo}</td>
                        <td>{row.financiado}</td>
                        <td>{JSON.stringify(row.inicio)}</td>
                        <td>{JSON.stringify(row.fin)}</td>
                    </tr>
                ))
            }
        </tbody>
    </table>
)}
