"use server"

import type { InvestigadorType } from "@/db"
import { createInvestigador } from "@/db"

import {
  getInvestigadorErrors,
  validateInvestigadorErrors,
} from "../validation/investigador"

export const addInvestigador = async (investigador: InvestigadorType) => {
  if (validateInvestigadorErrors(getInvestigadorErrors(investigador))) {
    createInvestigador(investigador)
  }
}
