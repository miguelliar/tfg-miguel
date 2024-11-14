import type { ProyectoType } from "@/db"

export type ProyectoToUpload = Omit<ProyectoType, "inicio" | "fin"> & {
  inicio: string
  fin: string
}

export const parseDate = (date: string) => {
  const [d, m, y] = date.split("/")
  return new Date(`${m}/${d}/${y}`)
}

export const mapProyectoToUploadToProyectType = (
  projectToUpload: ProyectoToUpload[]
): ProyectoType[] => {
  return projectToUpload.map((proyecto) => {
    const fechaInicio = parseDate(proyecto.inicio)
    const fechaFin = parseDate(proyecto.fin)

    return {
      ...proyecto,
      inicio: fechaInicio,
      fin: fechaFin,
    }
  })
}
