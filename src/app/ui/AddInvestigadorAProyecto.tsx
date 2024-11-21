"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

import type { InvestigadorType } from "@/db"
import { fetchInvestigadoresByNombre } from "@/db"

import { addParticipa } from "../utils/addParticipa"

export const AddInvestigadorAProyecto = ({ codigo }: { codigo: string }) => {
  const [nombre_autor, setNombreAutor] = useState("")
  const [investigadores, setInvestigadores] = useState<InvestigadorType[]>([])

  const searchForInvestigadores = () =>
    fetchInvestigadoresByNombre(nombre_autor).then(
      (investigadoresResult) =>
        investigadoresResult && setInvestigadores(investigadoresResult)
    )

  return (
    <section>
      <h3>Añadir investigador al proyecto</h3>
      <div>
        <input
          value={nombre_autor}
          onChange={(e) => {
            setNombreAutor(e.target.value)
          }}
          id="nombre_autor"
          type="text"
          name="nombre_autor"
          placeholder="Nombre de autor..."
          className="text-black"
          onSubmit={searchForInvestigadores}
        />
        <button type="button" onClick={searchForInvestigadores}>
          <MagnifyingGlassIcon className="h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
        </button>
        {investigadores.length > 0 ? (
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
                <th>Añadir</th>
              </tr>
            </thead>
            <tbody className="ProyectoTableBody">
              {investigadores.map((investigador) => (
                <tr key={`investigadorSearched${investigador.email}`}>
                  <td>{investigador.email}</td>
                  <td>{investigador.nombre}</td>
                  <td>{investigador.apellidos}</td>
                  <td>{investigador.universidad}</td>
                  <td>{investigador.departamento}</td>
                  <td>{investigador.area}</td>
                  <td>{investigador.figura}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => addParticipa(codigo, investigador.email)}
                    >
                      Añadir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      <div />
    </section>
  )
}
