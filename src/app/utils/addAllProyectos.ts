"use server"

import type { ProyectoType } from "@/db"
import {
  createParticipa,
  createProyectoItem,
  fetchInvestigadorByNombreAutor,
  fetchProyectoByCode,
} from "@/db"

const validateProyectoToAdd = async (proyecto: ProyectoType) => {
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

export const addAllProyectos = async (proyectos: ProyectoType[]) => {
  const repeatedProyectos: [ProyectoType, string][] = []
  for (const proyecto of proyectos) {
    // eslint-disable-next-line no-await-in-loop
    const errorMessage = await validateProyectoToAdd(proyecto)

    if (!errorMessage) {
      // eslint-disable-next-line no-await-in-loop
      const proyectoId = await createProyectoItem(proyecto)
      // eslint-disable-next-line no-await-in-loop
      const investigadorId = (await fetchInvestigadorByNombreAutor(
        proyecto.ip
      ))![0].id
      createParticipa(proyectoId!, Number(investigadorId))
    } else {
      repeatedProyectos.push([proyecto, errorMessage])
    }
  }
  return repeatedProyectos
}
