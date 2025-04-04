"use server"

import { createProyectoItem, fetchProyectoByCode } from "@/db"

import type { ProyectoType } from "../types"
import { MESSAGES } from "./infoMessage"

const errorValidation = async (proyecto: ProyectoType): Promise<string[]> => {
  const { codigo, inicio, fin } = proyecto
  const errors: string[] = []
  const isCodigoUsed = !(await fetchProyectoByCode(codigo))

  const isOnlyStartDate = inicio && !fin

  const isStartDateBeforeEndDate =
    inicio && fin && inicio.getTime() < fin.getTime()

  const areDatesValid = isOnlyStartDate || isStartDateBeforeEndDate

  if (!isCodigoUsed) {
    errors.push(MESSAGES.ERROR.CODIGO_DUPLICADO)
  }

  if (!areDatesValid) {
    errors.push(
      !isOnlyStartDate
        ? MESSAGES.ERROR.SIN_FECHA_INICIO
        : MESSAGES.ERROR.INTERVALO_FECHA
    )
  }

  return errors
}

export const addProyecto = async (proyecto: ProyectoType) => {
  const errorMessage = await errorValidation(proyecto)
  if (errorMessage.length === 0) {
    createProyectoItem(proyecto)
  }
}
