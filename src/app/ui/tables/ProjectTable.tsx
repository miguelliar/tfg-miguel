import Link from "next/link"
import { ProyectoType } from "../../../../db/db"
import './tableStyle.css'

export const ProjectTable = (
{
    projectData,
} : {
    projectData? : ProyectoType[]
}) => {
    return (
    <table className="ProyectoTable">
        <thead>
            <tr className="ProyectoTableHeadRow">
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
                        <td>
                            <Link href={`/proyectos?projectId=${row.codigo}`}>
                                {row.codigo}
                            </Link>
                        </td>
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
