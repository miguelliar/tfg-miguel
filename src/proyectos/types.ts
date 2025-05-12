export type ProyectoType = {
  codigo: string
  ip: string
  coip?: string
  titulo: string
  financiado: string
  inicio: Date
  fin?: Date
}

export type ProyectoMinimumDataType = Pick<ProyectoType, "codigo" | "titulo">
