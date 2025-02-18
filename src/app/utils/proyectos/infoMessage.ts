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
  },
  FILE: "Ha habido un error con el archivo. Por favor, pruebe de nuevo",
} as const

export type WarningMessage = {
  message: (typeof MESSAGES.WARNING)[keyof typeof MESSAGES.WARNING]
  nombreAutor: string
}

export type ErrorMessage = (typeof MESSAGES.ERROR)[keyof typeof MESSAGES.ERROR]

export type ProyectoMessage = {
  errors?: [ErrorMessage]
  warnings?: [WarningMessage]
  codigo: string
}

export enum InfoMessageType {
  WARNING,
  ERROR,
  FILE_ERROR,
}

export type InfoMessage = {
  type: InfoMessageType
  message: string
  codigo?: string
}

export const proyectoToInfoMessage = (
  message: ProyectoMessage
): InfoMessage[] => {
  const res: InfoMessage[] = []
  message.errors?.forEach((error) =>
    res.push({
      type: InfoMessageType.ERROR,
      message: error,
      codigo: message.codigo,
    })
  )

  message.warnings?.forEach((warning) =>
    res.push({
      type: InfoMessageType.WARNING,
      message: `${warning.message} ${warning.nombreAutor}`,
      codigo: message.codigo,
    })
  )

  return res
}
