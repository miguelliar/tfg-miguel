import { fetchProyectoByCode, updateProyectoItem } from "@/db"

import type { ProyectoType } from "./types"

const validateProyectoToUpdate = async (proyecto: ProyectoType) => {
  const isCodigoUsed = await fetchProyectoByCode(proyecto.codigo)
  const isOnlyStartDate = proyecto.inicio && !proyecto.fin
  const isStartDateBeforeEndDate =
    proyecto.inicio &&
    proyecto.fin &&
    proyecto.inicio.valueOf() < proyecto.fin.valueOf()

  const areDatesValid = isOnlyStartDate || isStartDateBeforeEndDate

  if (!isCodigoUsed) {
    return `Ya hay un proyecto con el mismo codigo (${proyecto.codigo})`
  }
  if (!areDatesValid) {
    return isOnlyStartDate
      ? "El proyecto debe tener al menos fecha de inicio"
      : "La fecha de finalización tiene que ser posterior a la de inicio"
  }
}

export const updateProyecto = async (
  proyecto: ProyectoType
): Promise<string | undefined> => {
  const errorMessage = await validateProyectoToUpdate(proyecto)
  if (errorMessage) {
    return errorMessage
  }
  updateProyectoItem(proyecto)
}
