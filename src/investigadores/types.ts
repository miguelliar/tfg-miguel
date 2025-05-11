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
