// To prevent circular dependencies this deep import is being used
import { fetchInvestigadorByEmail } from "../../investigadores/db/investigador"
import { fetchProyectoByCode } from "../../proyectos/db/proyecto"
import { deleteParticipa, fetchParticipa } from "../db"
import { ParticipaCommand } from "./participaCommand"

export class DeleteParticipaCommand extends ParticipaCommand {
  async execute() {
    const proyectoExist = await fetchProyectoByCode(this.participa.codigo)
    const investigadorExist = await fetchInvestigadorByEmail(
      this.participa.email
    )
    const participaExists = await fetchParticipa(
      this.participa.codigo,
      this.participa.email
    )

    if (proyectoExist && investigadorExist && participaExists) {
      deleteParticipa(this.participa.codigo, this.participa.email)
    } else {
      const error =
        (!proyectoExist && "No existe un proyecto asociado a ese codigo") ||
        (!investigadorExist &&
          "No existe un investigador asociado a ese email") ||
        "No hay un investigador participando en este proyecto"
      throw new Error(error)
    }
  }
}
