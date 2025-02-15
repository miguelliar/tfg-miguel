import type { ProyectoType } from "./types"

export type ProyectoToUpload = Omit<ProyectoType, "inicio" | "fin"> & {
  inicio: string
  fin?: string
}

export const parseDate = (date: string): Date => {
  const [d, m, y] = date.split("/")
  return new Date(`${m}/${d}/${y}`)
}

export const mapProyectoToUploadToProyectType = (
  projectToUpload: ProyectoToUpload[]
): ProyectoType[] => {
  return projectToUpload.map((proyecto) => {
    return {
      ...proyecto,
      inicio: parseDate(proyecto.inicio),
      fin: proyecto.fin ? parseDate(proyecto.fin) : undefined, // TODO: Improve this line
    }
  })
}
