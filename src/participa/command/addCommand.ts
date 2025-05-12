import {
  createParticipa,
  fetchInvestigadorByEmail,
  fetchProyectoByCode,
} from "@/db"

import { ParticipaCommand } from "./participaCommand"

export class AddParticipaCommand extends ParticipaCommand {
  async execute() {
    const proyectoExist = await fetchProyectoByCode(this.participa.codigo)
    const investigadorExist = await fetchInvestigadorByEmail(
      this.participa.email
    )

    if (proyectoExist && investigadorExist) {
      createParticipa(
        this.participa.email,
        this.participa.codigo,
        this.participa.nombreAutor
      )
    } else {
      const error = !proyectoExist
        ? "No existe un proyecto asociado a ese codigo"
        : "No existe un investigador asociado a ese email"
      throw new Error(error)
    }
  }
}
