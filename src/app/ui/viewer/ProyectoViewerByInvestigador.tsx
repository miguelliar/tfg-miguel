"use client"

import { useState } from "react"

import type { ProyectoType } from "@/app/utils"
import {
  downloadProyectosCSV,
  InvestigadorContext,
  useInvestigadoresSelected,
} from "@/app/utils"

import { ProjectTable } from "../containers"
import { MostrarProyectos } from "../MostrarProyectos"

export const ProyectoViewerByInvestigador = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedInvestigadores, selectInvestigador] =
    useInvestigadoresSelected()
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
      <InvestigadorContext.Provider
        value={{ selectedInvestigadores, select: selectInvestigador }}
      >
        {children}
      </InvestigadorContext.Provider>
      {searchedProyectos && searchedProyectos.length > 0 && (
        <div className="mt-4">
          <div>
            <h2>Investigadores seleccionados</h2>
            {selectedInvestigadores.map((investigador) => (
              <p key={investigador.email}>{investigador.email}</p>
            ))}
          </div>
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
