"use server"

import { createInvestigador } from "@/db"

import type { InvestigadorType } from "../types"
import { getInvestigadorErrors, validateInvestigadorErrors } from "./validation"

export const addInvestigador = async (investigador: InvestigadorType) => {
  if (validateInvestigadorErrors(getInvestigadorErrors(investigador))) {
    createInvestigador(investigador)
  }
}
