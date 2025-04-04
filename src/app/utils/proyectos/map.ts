import { getStringDate } from "../formatDate"
import type { ParticipaType, ProyectoType } from "../types"
import type { ProyectoMessage } from "./infoMessage"

export type ProyectoToUpload = Omit<ProyectoType, "inicio" | "fin"> & {
  inicio: string
  fin?: string
  participantes: ParticipaType[]
  messages: ProyectoMessage
}

export const parseDate = (date: string, separator: string = "/"): Date => {
  if (separator === "/") {
    const [d, m, y] = date.split(separator)
    return new Date(`${m}/${d}/${y}`)
  }
  const [y, m, d] = date.split(separator)
  return new Date(`${m}/${d}/${y}`)
}

export const mapProyectoTypeToProyectoToUpload = ({
  proyecto,
  participaciones,
  mensajes,
}: {
  proyecto: ProyectoType
  participaciones?: ParticipaType[]
  mensajes?: ProyectoMessage
}): ProyectoToUpload => {
  return {
    ...proyecto,
    inicio:
      typeof proyecto.inicio === "string"
        ? getStringDate(new Date(proyecto.inicio))
        : getStringDate(proyecto.inicio),
    fin:
      typeof proyecto.fin === "string"
        ? getStringDate(new Date(proyecto.fin))
        : getStringDate(proyecto.fin),
    participantes: participaciones ?? [],
    messages: {
      errors: mensajes?.errors,
      warnings: mensajes?.warnings,
    },
  }
}

export const mapProyectoToUploadToProyectType = (
  proyecto: ProyectoToUpload
): ProyectoType => {
  return {
    ...proyecto,
    inicio: parseDate(proyecto.inicio),
    fin: proyecto.fin ? parseDate(proyecto.fin) : undefined, // TODO: Improve this line
  }
}

export const mapProyectosToUploadToProyectsType = (
  projectToUpload: ProyectoToUpload[]
): ProyectoType[] => {
  return projectToUpload.map((proyecto) =>
    mapProyectoToUploadToProyectType(proyecto)
  )
}
