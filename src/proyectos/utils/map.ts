import type { ParticipaType } from "@/participa"
import { getStringDate } from "@/utils"

import type { ProyectoType } from "../types"
import type { ProyectoMessage } from "./infoMessage"

export type ProyectoToUpload = Omit<ProyectoType, "inicio" | "fin"> & {
  inicio: string
  fin?: string
  participantes: ParticipaType[]
  messages: ProyectoMessage
}

// TODO: Refactor and extract to formatDate utils
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
        ? getStringDate(new Date(proyecto.inicio)) // This is required as the map is being used in a form where the date is obtained as a string
        : getStringDate(proyecto.inicio),
    fin:
      typeof proyecto.fin === "string"
        ? getStringDate(new Date(proyecto.fin)) // This is required as the map is being used in a form where the date is obtained as a string
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

// TODO: Remove this function
export const mapProyectosToUploadToProyectsType = (
  projectToUpload: ProyectoToUpload[]
): ProyectoType[] => {
  return projectToUpload.map((proyecto) =>
    mapProyectoToUploadToProyectType(proyecto)
  )
}
