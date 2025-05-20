export const MESSAGES = {
  WARNING: {
    NO_NOMBRE_AUTOR_PARA_IP: "No hay un IP con el nombre de autor",
    MULTIPLE_NOMBRE_AUTOR_PARA_IP: "Hay más de un nombre de autor para el IP",
  },
  ERROR: {
    CODIGO_DUPLICADO: "Ya hay un proyecto con el mismo código",
    SIN_FECHA_INICIO: "El proyecto debe tener fecha de inicio",
    INTERVALO_FECHA:
      "La fecha de finalización tiene que ser posterior a la de inicio",
    FORMATO_FECHA: "El formato de la fecha debe ser el siguiente: dd/mm/yyyy",
  },
  FILE: "Ha habido un error con el archivo. Por favor, pruebe de nuevo",
} as const

export type WarningMessage = {
  message: (typeof MESSAGES.WARNING)[keyof typeof MESSAGES.WARNING]
  nombreAutor: string
}

export type ErrorMessage = {
  message: (typeof MESSAGES.ERROR)[keyof typeof MESSAGES.ERROR]
  read: boolean
}

export type ProyectoMessage = {
  errors?: ErrorMessage[]
  warnings?: WarningMessage[]
}
