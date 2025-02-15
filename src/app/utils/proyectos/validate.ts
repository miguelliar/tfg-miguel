import { fetchInvestigadorByNombreAutor, fetchProyectoByCode } from "@/db"

import type { ProyectoType } from "../types"

export const validateProyectoToAdd = async (proyecto: ProyectoType) => {
  const { codigo, ip, inicio, fin } = proyecto

  const isCodigoUsed = !(await fetchProyectoByCode(codigo))
  const isIPExisting = await fetchInvestigadorByNombreAutor(ip)

  const isOnlyStartDate = inicio && !fin
  const isStartDateBeforeEndDate =
    inicio && fin && inicio.valueOf() < fin.valueOf()

  const areDatesValid = isOnlyStartDate || isStartDateBeforeEndDate

  if (!isCodigoUsed) {
    return `Ya hay un proyecto con el mismo codigo (${codigo})`
  }
  if (!isIPExisting || (isIPExisting && isIPExisting.length === 0)) {
    return `No hay un investigador principal con el nombre de autor '${ip}'`
  }
  if (!areDatesValid) {
    return isOnlyStartDate
      ? "El proyecto debe tener al menos fecha de inicio"
      : "La fecha de finalización tiene que ser posterior a la de inicio"
  }
}
