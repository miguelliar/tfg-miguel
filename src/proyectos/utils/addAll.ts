"use server"

import type { ProyectoType } from "../types"
import { addProyecto } from "./add"

// TODO: add status validation for when success and when there is a failure
export const addAllProyectos = async (proyectos: ProyectoType[]) => {
  for (const proyecto of proyectos) {
    addProyecto(proyecto)
  }
}
