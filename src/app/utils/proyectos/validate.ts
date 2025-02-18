"use server"

import { fetchInvestigadorByNombreAutor, fetchProyectoByCode } from "@/db"

import type { ProyectoType } from "../types"
import type { InfoMessage, ProyectoMessage } from "./infoMessage"
import { InfoMessageType, MESSAGES, proyectoToInfoMessage } from "./infoMessage"

export const validateProyectosToAdd = (
  proyectos: ProyectoType[]
): Promise<InfoMessage[]> => {
  const errorMessagesPromise = proyectos?.reduce<Promise<ProyectoMessage>[]>(
    (errorsMessages, proyecto) =>
      errorsMessages.concat(validateProyectoToAdd(proyecto)),
    []
  )

  return Promise.all(errorMessagesPromise).then((errorMessage) => {
    let infoMessages: InfoMessage[] = []
    errorMessage.forEach((error) => {
      infoMessages = infoMessages.concat(proyectoToInfoMessage(error))
    })
    infoMessages.sort((a, b) => {
      const firstType = a.type
      const secondType = b.type

      if (firstType === secondType) return 0
      if (firstType === InfoMessageType.WARNING) return -1
      if (secondType === InfoMessageType.WARNING) return 1
      return 0
    })
    return infoMessages
  })
}

export const validateProyectoToAdd = async (
  proyecto: ProyectoType
): Promise<ProyectoMessage> => {
  const { codigo, ip, inicio, fin } = proyecto
  const infoMessage: ProyectoMessage = {
    codigo,
  }

  const isCodigoUsed = !(await fetchProyectoByCode(codigo))
  const isIPExisting = await fetchInvestigadorByNombreAutor(ip)

  const isOnlyStartDate = inicio && !fin
  const isStartDateBeforeEndDate =
    inicio && fin && inicio.valueOf() < fin.valueOf()

  const areDatesValid = isOnlyStartDate || isStartDateBeforeEndDate

  if (!isCodigoUsed) {
    infoMessage.errors = [MESSAGES.ERROR.CODIGO_DUPLICADO]
  }

  if (!areDatesValid) {
    const dateError = !isOnlyStartDate
      ? MESSAGES.ERROR.SIN_FECHA_INICIO
      : MESSAGES.ERROR.INTERVALO_FECHA

    if (!infoMessage.errors) infoMessage.errors = [dateError]
    else infoMessage.errors.push(dateError)
  }

  if (!isIPExisting || (isIPExisting && isIPExisting.length === 0)) {
    infoMessage.warnings = [
      { message: MESSAGES.WARNING.NO_NOMBRE_AUTOR_PARA_IP, nombreAutor: ip },
    ]
  }

  if (isIPExisting && isIPExisting.length > 0) {
    infoMessage.warnings = [
      {
        message: MESSAGES.WARNING.MULTIPLE_NOMBRE_AUTOR_PARA_IP,
        nombreAutor: ip,
      },
    ]
  }

  return infoMessage
}
