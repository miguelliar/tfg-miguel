"use server"

import { createProyectoItem } from "@/db"

import type { ProyectoType } from "../types"
import { validateProyectoToAdd } from "./validate"

export const addProyecto = async (proyecto: ProyectoType) => {
  const errorMessage = await validateProyectoToAdd(proyecto)
  if (!errorMessage.errors) {
    createProyectoItem(proyecto)
  }
}
