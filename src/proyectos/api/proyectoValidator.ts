"use server"

import { fetchInvestigadorByNombreAutor, fetchProyectoByCode } from "@/db"
import type { ParticipaType } from "@/participa"

import type {
  ErrorMessage,
  ProyectoMessage,
  ProyectoToUpload,
  WarningMessage,
} from "../utils"
import { MESSAGES } from "../utils"

export const validateProyectosToAdd = async (
  proyectos: ProyectoToUpload[]
): Promise<ProyectoToUpload[]> => {
  const proyectosValidated = proyectos?.map<Promise<ProyectoToUpload>>(
    (proyecto) => validateProyectoToAdd(proyecto)
  )

  return Promise.all(proyectosValidated)
}

export const validateProyectoToAdd = async (
  proyecto: ProyectoToUpload
): Promise<ProyectoToUpload> => {
  const infoMessage: ProyectoMessage = {}

  infoMessage.errors = await errorValidation(proyecto)
  infoMessage.warnings = await warningValidation(proyecto)
  const participantes = await setParticipationAutomatic(proyecto)

  return {
    ...proyecto,
    participantes:
      proyecto.participantes?.length > 0
        ? proyecto.participantes
        : participantes,
    messages: infoMessage,
  }
}

const errorValidation = async (
  proyecto: ProyectoToUpload
): Promise<ErrorMessage[]> => {
  const { codigo, inicio, fin } = proyecto
  const errors: ErrorMessage[] = []
  const isCodigoUsed = !(await fetchProyectoByCode(codigo))

  const isOnlyStartDate = inicio && !fin
  const [dI, mI, yI] = inicio.split("/")
  const [dF, mF, yF] = (fin ?? "").split("/")

  const inicioDate = new Date(`${mI}-${dI}-${yI}`)
  const finDate = new Date(`${mF}-${dF}-${yF}`)

  const isStartDateBeforeEndDate =
    inicio && fin && inicioDate.getTime() < finDate.getTime()

  const areDatesValid = isOnlyStartDate || isStartDateBeforeEndDate

  if (!isCodigoUsed) {
    errors.push({ message: MESSAGES.ERROR.CODIGO_DUPLICADO, read: false })
  }

  if (!areDatesValid) {
    errors.push({
      message: isOnlyStartDate
        ? MESSAGES.ERROR.SIN_FECHA_INICIO
        : MESSAGES.ERROR.INTERVALO_FECHA,
      read: false,
    })
  }

  return errors
}

const warningValidation = async (
  proyecto: ProyectoToUpload
): Promise<WarningMessage[]> => {
  const { ip } = proyecto
  const isIPExisting = await fetchInvestigadorByNombreAutor(ip)
  const warnings = []
  if (!isIPExisting || (isIPExisting && isIPExisting.length === 0)) {
    warnings.push({
      message: MESSAGES.WARNING.NO_NOMBRE_AUTOR_PARA_IP,
      nombreAutor: ip,
      read: false,
    })
  }

  if (isIPExisting && isIPExisting.length > 1) {
    warnings.push({
      message: MESSAGES.WARNING.MULTIPLE_NOMBRE_AUTOR_PARA_IP,
      nombreAutor: ip,
      read: false,
    })
  }

  return warnings
}

const setParticipationAutomatic = async (proyecto: ProyectoToUpload) => {
  const { ip, coip } = proyecto

  const participaciones: ParticipaType[] = []
  const ipEmail = await fetchInvestigadorByNombreAutor(ip)

  if (ipEmail && ipEmail.length === 1) {
    participaciones.push({
      codigo: proyecto.codigo,
      email: ipEmail[0].email,
      nombreAutor: ip,
    })
  }
  if (coip) {
    const coipEmail = await fetchInvestigadorByNombreAutor(coip)

    if (coipEmail && coipEmail.length === 1) {
      participaciones.push({
        codigo: proyecto.codigo,
        email: coipEmail[0].email,
        nombreAutor: coip,
      })
    }
  }

  return participaciones
}
