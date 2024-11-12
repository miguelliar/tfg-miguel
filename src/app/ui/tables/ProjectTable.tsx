import "./tableStyle.css"

import Link from "next/link"

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
              <td>{row.titulo}</td>
              <td>{row.financiado}</td>
              <td>
                {row.inicio
                  ? row.inicio.toLocaleDateString(undefined, {
                      formatMatcher: "basic",
                    })
                  : "Sin inicio"}
              </td>
              <td>
                {row.fin
                  ? row.inicio.toLocaleDateString(undefined, {
                      formatMatcher: "basic",
                    })
                  : "Sin fin"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
