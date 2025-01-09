"use client"

import { useState } from "react"

import {
  fetchAllProyectosByInvestigadores,
  type InvestigadorType,
  type ProyectoType,
} from "@/db"

import { InvestigadorMiniCard } from "../../cards/investigador/InvestigadorMiniCard"
import { ProjectTable } from "../tables/ProjectTable"
import { useInvestigadorGrid } from "./useInvestigadorGrid"

const click = async (
  selectedInvestigadores: string[],
  setSearchedProyectos: any
) => {
  const proyectos = await fetchAllProyectosByInvestigadores(
    selectedInvestigadores
  )
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
      <div>
        <button
          type="button"
          onClick={() =>
            click(
              selectedInvestigadores.map((investigador) => investigador.email),
              setSearchedProyectos
            )
          }
        >
          Mostrar proyectos en comun
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
        </div>
      )}
    </>
  )
}
