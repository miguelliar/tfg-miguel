import type { InvestigadorType } from "@/db"

import { ERROR_MESSAGES } from "./constants"

export type InvestigadorValidationErrors = {
  email: string
  nombre: string
  apellidos: string
  universidad: string
  departamento: string
  area: string
  figura: string
}

const message = ERROR_MESSAGES.INVESTIGADOR

const checkFieldEmpty = (field: string, message: string) => {
  return !field || field.trim().length === 0 ? message : ""
}

export const getInvestigadorErrors = (
  investigador: InvestigadorType
): InvestigadorValidationErrors => ({
  email: checkFieldEmpty(investigador.email, message.EMPTY.EMAIL),
  nombre: checkFieldEmpty(investigador.nombre, message.EMPTY.NOMBRE),
  apellidos: checkFieldEmpty(investigador.apellidos, message.EMPTY.APELLIDOS),
  universidad: checkFieldEmpty(
    investigador.universidad,
    message.EMPTY.UNIVERSIDAD
  ),
  departamento: checkFieldEmpty(
    investigador.departamento,
    message.EMPTY.DEPARTAMENTO
  ),
  area: checkFieldEmpty(investigador.area, message.EMPTY.AREA),
  figura: checkFieldEmpty(investigador.figura, message.EMPTY.FIGURA),
})

export const validateInvestigadorErrors = (
  errors: InvestigadorValidationErrors
) =>
  !errors.email &&
  !errors.nombre &&
  !errors.apellidos &&
  !errors.universidad &&
  !errors.departamento &&
  !errors.area &&
  !errors.figura
