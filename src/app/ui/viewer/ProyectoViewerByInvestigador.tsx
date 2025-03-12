"use client"

import { useState } from "react"

import { SearchProyectoByInvestigadorContext } from "@/app/utils"

import { MostrarProyectos } from "../MostrarProyectos"

export const ProyectoViewerByInvestigador = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [
    isSearchProyectoByInvestigadorEnabled,
    setIsSearchProyectoByInvestigadorEnabled,
  ] = useState(false)

  return (
    <>
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
      {isSearchProyectoByInvestigadorEnabled ? <MostrarProyectos /> : null}
    </>
  )
}
