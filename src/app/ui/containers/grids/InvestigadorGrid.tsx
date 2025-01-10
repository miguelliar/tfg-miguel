"use client"

import { useState } from "react"

import { downloadProyectosCSV } from "@/app/utils"
import {
  fetchAllProyectosByInvestigadores,
  fetchDistinctProyectosByInvestigadores,
  fetchJoinProyectosByInvestigadores,
  type InvestigadorType,
  type ProyectoType,
} from "@/db"

import { InvestigadorMiniCard } from "../../cards/investigador/InvestigadorMiniCard"
import { ProjectTable } from "../tables/ProjectTable"
import { useInvestigadorGrid } from "./useInvestigadorGrid"

const click = async (
  fetchByInvestigadorFunction: (
    investigadoresEmail: string[]
  ) => Promise<ProyectoType[] | undefined>,
  selectedInvestigadores: string[],
  setSearchedProyectos: any
) => {
  const proyectos = await fetchByInvestigadorFunction(selectedInvestigadores)
  setSearchedProyectos(proyectos)
}

export const InvestigadorGrid = ({
  investigadores,
}: {
  investigadores?: InvestigadorType[]
}) => {
  const [selectedInvestigadores, selectInvestigador] = useInvestigadorGrid()

  const [searchedProyectos, setSearchedProyectos] = useState<ProyectoType[]>([])

  return (
    <>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() =>
            click(
              fetchAllProyectosByInvestigadores,
              selectedInvestigadores.map((investigador) => investigador.email),
              setSearchedProyectos
            )
          }
        >
          Mostrar proyectos en los que participe al menos un investigador
        </button>
        <button
          type="button"
          onClick={() =>
            click(
              fetchJoinProyectosByInvestigadores,
              selectedInvestigadores.map((investigador) => investigador.email),
              setSearchedProyectos
            )
          }
        >
          Mostrar proyectos en los que participen todos los investigadores
        </button>
        <button
          type="button"
          onClick={() =>
            click(
              fetchDistinctProyectosByInvestigadores,
              selectedInvestigadores.map((investigador) => investigador.email),
              setSearchedProyectos
            )
          }
        >
          Mostrar proyectos en los que no participen en conjunto
        </button>
      </div>
      <div className="grid grid-cols-adaptable gap-4">
        {investigadores &&
          investigadores.map((investigador) => (
            <InvestigadorMiniCard
              key={`ProyectoCard-${investigador.email}`}
              investigador={investigador}
              select={selectInvestigador}
            />
          ))}
      </div>
      {searchedProyectos && searchedProyectos.length > 0 && (
        <div className="mt-4">
          <ProjectTable projectData={searchedProyectos} />
          <button
            type="button"
            onClick={() => downloadProyectosCSV(searchedProyectos)}
          >
            Descargar proyectos en CSV
          </button>
        </div>
      )}
    </>
  )
}
