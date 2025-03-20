import type { ParticipaType } from "../types"

export class ParticipaCommand {
  participa: ParticipaType

  constructor(participa: ParticipaType) {
    this.participa = participa
  }

  // This is necessary as its the interface of the Command method
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  execute() {}
}
