import type { ProyectoType } from "../types"
import { ERROR_MESSAGES } from "./constants"

export type ProyectoValidationErrors = {
  codigo: string
  ip: string
  coip: string
  titulo: string
  financiado: string
  fechaInicio: string
  fechaFin: string
}

const message = ERROR_MESSAGES.PROYECTO

const checkFieldEmpty = (field: string, message: string) => {
  return !field || field.trim().length === 0 ? message : ""
}

const checkDuplicatedIP = (ip: string, coIp?: string) => {
  return coIp && ip === coIp ? message.INVALID_DATA.DUPLICATED_IP : ""
}

const checkIntervalDates = (inicio: Date, fin?: Date) => {
  return inicio && fin && new Date(fin).valueOf() < new Date(inicio).valueOf()
    ? message.INVALID_DATA.FIN_ANTES_INICIO
    : ""
}

export const getProyectoErrors = (
  proyecto: ProyectoType
): ProyectoValidationErrors => ({
  codigo: checkFieldEmpty(proyecto.codigo, message.EMPTY.CODIGO),
  ip: checkFieldEmpty(proyecto.ip, message.EMPTY.IP),
  coip: checkDuplicatedIP(proyecto.ip, proyecto.coip),
  titulo: checkFieldEmpty(proyecto.titulo, message.EMPTY.TITULO),
  financiado: checkFieldEmpty(proyecto.financiado, message.EMPTY.FINANCIADO),
  fechaInicio: !proyecto.inicio ? message.EMPTY.FECHA_INICIO : "",
  fechaFin: checkIntervalDates(proyecto.inicio, proyecto.fin),
})
