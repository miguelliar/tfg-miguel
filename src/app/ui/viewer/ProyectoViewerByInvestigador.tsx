"use client"

import { useState } from "react"

import {
  InvestigadorContext,
  SearchProyectoByInvestigadorContext,
} from "@/app/utils"

import { MostrarProyectos } from "../MostrarProyectos"
import { useInvestigadoresSelected } from "./useInvestigadoresSelected"

export const ProyectoViewerByInvestigador = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [
    isSearchProyectoByInvestigadorEnabled,
    setIsSearchProyectoByInvestigadorEnabled,
  ] = useState(false)
  const [selectedInvestigadores, selectInvestigador, clearAllSelected] =
    useInvestigadoresSelected()

  return (
    <InvestigadorContext.Provider
      value={{
        selectedInvestigadores,
        select: selectInvestigador,
        clearAllSelected,
      }}
    >
      <SearchProyectoByInvestigadorContext.Provider
        value={{
          isSearchProyectosByInvestigadorActive:
            isSearchProyectoByInvestigadorEnabled,
          switchSearchProyectosByInvestigadorActive: () =>
            setIsSearchProyectoByInvestigadorEnabled(
              !isSearchProyectoByInvestigadorEnabled
            ),
        }}
      >
        {children}
      </SearchProyectoByInvestigadorContext.Provider>
      {isSearchProyectoByInvestigadorEnabled ? (
        <MostrarProyectos selectedInvestigadores={selectedInvestigadores} />
      ) : null}
    </InvestigadorContext.Provider>
  )
}
