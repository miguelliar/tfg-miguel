import { removeParticipa } from "./crudActions"
import { ParticipaCommand } from "./participaCommand"

export class DeleteParticipaCommand extends ParticipaCommand {
  execute() {
    removeParticipa(this.participa)
  }
}
