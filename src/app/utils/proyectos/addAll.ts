"use server"

import { createProyectoItem } from "@/db"

import type { ProyectoType } from "../types"
import { validateProyectoToAdd } from "./validate"

// TODO: add status validation for when success and when there is a failure
export const addAllProyectos = async (proyectos: ProyectoType[]) => {
  for (const proyecto of proyectos) {
    // eslint-disable-next-line no-await-in-loop
    const errorMessage = await validateProyectoToAdd(proyecto)

    if (!errorMessage.errors) {
      createProyectoItem(proyecto)
    }
  }
}
