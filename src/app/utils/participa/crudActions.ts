import {
  createParticipa,
  deleteParticipa,
  fetchInvestigadorByEmail,
  fetchParticipa,
  fetchProyectoByCode,
} from "@/db"

import type { ParticipaType } from "../types"

export const removeParticipa = async ({ codigo, email }: ParticipaType) => {
  const proyectoExist = await fetchProyectoByCode(codigo)
  const investigadorExist = await fetchInvestigadorByEmail(email)
  const participaExists = await fetchParticipa(codigo, email)

  if (proyectoExist && investigadorExist && participaExists) {
    deleteParticipa(codigo, email)
  } else {
    const error =
      (!proyectoExist && "No existe un proyecto asociado a ese codigo") ||
      (!investigadorExist &&
        "No existe un investigador asociado a ese email") ||
      "No hay un investigador participando en este proyecto"
    throw new Error(error)
  }
}

export const addParticipa = async ({
  codigo,
  email,
  nombreAutor,
}: {
  codigo: string
  email: string
  nombreAutor: string
}) => {
  const proyectoExist = await fetchProyectoByCode(codigo)
  const investigadorExist = await fetchInvestigadorByEmail(email)

  if (proyectoExist && investigadorExist) {
    createParticipa(email, codigo, nombreAutor)
  } else {
    const error = !proyectoExist
      ? "No existe un proyecto asociado a ese codigo"
      : "No existe un investigador asociado a ese email"
    throw new Error(error)
  }
}
