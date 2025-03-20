import { addParticipa } from "./crudActions"
import { ParticipaCommand } from "./participaCommand"

export class AddParticipaCommand extends ParticipaCommand {
  execute() {
    addParticipa(this.participa)
  }
}
