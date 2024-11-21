import "./tableStyle.css"

import type { InvestigadorType } from "@/db"

export const InvestigadorTable = ({
  investigadorData,
}: {
  investigadorData?: InvestigadorType[]
}) => {
  return (
    <table className="ProyectoTable">
      <thead>
        <tr className="ProyectoTableHeadRow">
          <th>Email</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Universidad</th>
          <th>Departamento</th>
          <th>Area</th>
          <th>Figura</th>
        </tr>
      </thead>
      <tbody className="ProyectoTableBody">
        {investigadorData &&
          investigadorData.map((row) => (
            <tr key={row.email}>
              <td>{row.email}</td>
              <td>{row.nombre}</td>
              <td>{row.apellidos}</td>
              <td>{row.universidad}</td>
              <td>{row.departamento}</td>
              <td>{row.area}</td>
              <td>{row.figura}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
