"use client"

import { useState } from "react"

import { downloadProyectosCSV } from "@/app/utils"
import { type InvestigadorType, type ProyectoType } from "@/db"

import { InvestigadorMiniCard } from "../../cards/investigador/InvestigadorMiniCard"
import { MostrarProyectos } from "../../MostrarProyectos"
import { ProjectTable } from "../tables/ProjectTable"
import { useInvestigadorGrid } from "./useInvestigadorGrid"

export const InvestigadorGrid = ({
  investigadores,
}: {
  investigadores?: InvestigadorType[]
}) => {
  const [selectedInvestigadores, selectInvestigador] = useInvestigadorGrid()

  const [searchedProyectos, setSearchedProyectos] = useState<ProyectoType[]>([])

  const fetchSearchedProyectos = async (
    fetchByInvestigadorFunction: (
      investigadoresEmail: string[]
    ) => Promise<ProyectoType[] | undefined>
  ) => {
    const proyectos = await fetchByInvestigadorFunction(
      selectedInvestigadores.map((investigador) => investigador.email)
    )
    if (proyectos) {
      setSearchedProyectos(proyectos)
    }
  }

  return (
    <>
      <MostrarProyectos fetchSearchedProyectos={fetchSearchedProyectos} />
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
