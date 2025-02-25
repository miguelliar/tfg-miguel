"use client"

import { createContext } from "react"

import type { InvestigadorType } from "@/db"

export type SelectInvestigador = (props: {
  investigadorSelected: InvestigadorType
}) => void

/**
 * Context that will store the function to set an investigador to be selected or not
 */
export const InvestigadorContext = createContext<{
  selectedInvestigadores: InvestigadorType[]
  select: SelectInvestigador | null
}>({ selectedInvestigadores: [], select: null })
