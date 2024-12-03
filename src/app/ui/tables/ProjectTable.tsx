import "./tableStyle.css"

import Link from "next/link"

import { getStringDate } from "@/app/utils/formatDate"
import type { ProyectoType } from "@/db"

export const ProjectTable = ({
  projectData,
}: {
  projectData?: ProyectoType[]
}) => {
  return (
    <table className="ProyectoTable">
      <thead>
        <tr className="ProyectoTableHeadRow">
          <th>Codigo</th>
          <th>Investigador Principal</th>
          <th>Co-Investigador Principal</th>
          <th>Titulo</th>
          <th>Financiado</th>
          <th>Inicio</th>
          <th>Fin</th>
        </tr>
      </thead>
      <tbody className="ProyectoTableBody">
        {projectData &&
          projectData.map((row) => (
            <tr key={row.codigo} className="ProyectoTableRow">
              <td>
                <Link href={`/proyectos?codigo=${row.codigo}`}>
                  {row.codigo}
                </Link>
              </td>
              <td>{row.ip}</td>
              <td>{row.coip}</td>
              <td>{row.titulo}</td>
              <td>{row.financiado}</td>
              <td>{getStringDate(row.inicio, "Sin inicio")}</td>
              <td>{getStringDate(row.fin, "Sin fin")}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
