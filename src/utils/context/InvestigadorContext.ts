"use client"

import { createContext } from "react"

import type { InvestigadorType } from "@/investigadores"

// TODO: Move this to Investigador folder
export type SelectInvestigador = (props: {
  investigadorSelected: InvestigadorType
}) => void

export const SearchProyectoByInvestigadorContext = createContext<{
  isSearchProyectosByInvestigadorActive: boolean
  switchSearchProyectosByInvestigadorActive: () => void
}>({
  isSearchProyectosByInvestigadorActive: false,
  switchSearchProyectosByInvestigadorActive: () => {},
})
