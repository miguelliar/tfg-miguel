"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { SearchProyectoByInvestigadorContext } from "@/app/utils"

import { MostrarProyectos } from "./MostrarProyectos"

export const ProyectoViewerByInvestigador = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const searchParams = useSearchParams()
  const isSearchActive = new URLSearchParams(searchParams ?? "").has(
    "selectedEmail"
  )
  const [
    isSearchProyectoByInvestigadorEnabled,
    setIsSearchProyectoByInvestigadorEnabled,
  ] = useState(isSearchActive)

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
