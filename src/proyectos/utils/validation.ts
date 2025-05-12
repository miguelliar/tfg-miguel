import { fetchProyectoByCode } from "@/db"

import type { ProyectoType } from "../types"

export type ProyectoValidationErrors = {
  codigo: string
  ip: string
  coip: string
  titulo: string
  financiado: string
  fechaInicio: string
  fechaFin: string
}

const message = {
  EMPTY: {
    CODIGO: "El codigo no puede estar vacío",
    IP: "El investigador principal no puede estar vacío",
    TITULO: "El titulo no puede estar vacío",
    FINANCIADO: "La financiación no puede estar vacía",
    FECHA_INICIO: "La fecha de inicio no puede estar vacía",
  },
  INVALID_DATA: {
    DUPLICATED_IP:
      "El co-investigador principal no ser el mismo que el investigador principal",
    FIN_ANTES_INICIO:
      "La fecha de finalización no puede ser anterior a la de inicio",
    DUPLICATED_CODIGO:
      "El código empleado ya está siendo utilizado en otro proyecto. Comprueba que tu proyecto no haya sido añadido.",
  },
}

const duplicatedCodigo = async (codigo: string) => {
  const existingProyecto = await fetchProyectoByCode(codigo)
  return existingProyecto ? message.INVALID_DATA.DUPLICATED_CODIGO : ""
}

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

export const getProyectoErrors = async (
  proyecto: ProyectoType
): Promise<ProyectoValidationErrors> => ({
  codigo:
    checkFieldEmpty(proyecto.codigo, message.EMPTY.CODIGO) ||
    (await duplicatedCodigo(proyecto.codigo)),
  ip: checkFieldEmpty(proyecto.ip, message.EMPTY.IP),
  coip: checkDuplicatedIP(proyecto.ip, proyecto.coip),
  titulo: checkFieldEmpty(proyecto.titulo, message.EMPTY.TITULO),
  financiado: checkFieldEmpty(proyecto.financiado, message.EMPTY.FINANCIADO),
  fechaInicio: !proyecto.inicio ? message.EMPTY.FECHA_INICIO : "",
  fechaFin: checkIntervalDates(proyecto.inicio, proyecto.fin),
})
