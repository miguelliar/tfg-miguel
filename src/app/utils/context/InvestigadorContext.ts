"use client"

import { createContext } from "react"

import type { InvestigadorType } from "@/db"

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

/**
 * Context that will store the function to set an investigador to be selected or not
 */
export const InvestigadorContext = createContext<{
  selectedInvestigadores: InvestigadorType[]
  select: SelectInvestigador | null
  clearAllSelected: () => void
}>({ selectedInvestigadores: [], select: null, clearAllSelected: () => {} })
