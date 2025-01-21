export type InvestigadorType = {
  email: string
  nombre: string
  apellidos: string
  universidad: string
  departamento: string
  area: string
  figura: string
}

export type ProyectoType = {
  codigo: string
  ip: string
  coip?: string
  titulo: string
  financiado: string
  inicio: Date
  fin?: Date
}
