"use server"

import {
  createParticipa,
  createProyectoItem,
  fetchInvestigadorByNombreAutor,
} from "@/db"

import type { ProyectoType } from "../types"
import { validateProyectoToAdd } from "./validate"

export const addAllProyectos = async (proyectos: ProyectoType[]) => {
  const repeatedProyectos: [ProyectoType, string][] = []
  for (const proyecto of proyectos) {
    // eslint-disable-next-line no-await-in-loop
    const errorMessage = await validateProyectoToAdd(proyecto)

    if (!errorMessage) {
      createProyectoItem(proyecto)
      // eslint-disable-next-line no-await-in-loop
      const investigadorEmail = (await fetchInvestigadorByNombreAutor(
        proyecto.ip
      ))![0].email
      createParticipa(investigadorEmail, proyecto.codigo!)
    } else {
      repeatedProyectos.push([proyecto, errorMessage])
    }
  }
  return repeatedProyectos
}
