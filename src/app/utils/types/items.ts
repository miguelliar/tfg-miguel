export type InvestigadorType = {
  email: string
  nombre: string
  apellidos: string
  universidad: string
  departamento: string
  area: string
  figura: string
}

export type InvestigadorMinimumDataType = Pick<
  InvestigadorType,
  "email" | "nombre" | "apellidos"
>

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

export type ParticipaType = {
  codigo: string
  email: string
  nombreAutor: string
}
