import {
  createParticipa,
  fetchInvestigadorByEmail,
  fetchProyectoByCode,
} from "@/db"

export const addParticipa = async (codigo: string, email: string) => {
  const proyectoExist = await fetchProyectoByCode(codigo)
  const investigadorExist = await fetchInvestigadorByEmail(email)

  if (proyectoExist && investigadorExist) {
    createParticipa(email, codigo)
  } else {
    const error = !proyectoExist
      ? "No existe un proyecto asociado a ese codigo"
      : "No existe un investigador asociado a ese email"
    throw new Error(error)
  }
}
