"use client"

import { createContext } from "react"

import type { SelectInvestigador } from "../types"

export const SelectInvestigadorContext =
  createContext<SelectInvestigador | null>(null)
