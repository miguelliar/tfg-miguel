/* eslint-disable no-console */

"use server"

import config from "../constants.json"
import { getPool } from "../pool"

const proyectoConfig = config.proyecto
const pool = getPool()

export type ProyectoType = {
  id: string
  codigo: string
  ip: string
  titulo: string
  financiado: string
  inicio: Date
  fin: Date
}

export const fetchProyectoData = async () => {
  try {
    const result = await pool.query<ProyectoType>(proyectoConfig.fetch.All)
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchProyectoByCode = async (code: string) => {
  try {
    const result = await pool.query<ProyectoType>(
      proyectoConfig.fetch.ByCodigo,
      [code]
    )
    return result.rows[0]
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export async function createProyectoItem(proyecto: ProyectoType) {
  const { codigo, ip, titulo, financiado, inicio, fin } = proyecto

  const id = await fetchLastAvailableProyectoId()

  try {
    await pool.query(proyectoConfig.Create, [
      id,
      codigo,
      ip,
      titulo,
      financiado,
      inicio,
      fin ?? "NULL",
    ])

    return id
  } catch (error) {
    console.error(proyectoConfig.error.Inserting, error)
  }
}

export const fetchLastAvailableProyectoId = async () => {
  try {
    const result = await pool.query<{ lastid: number }>(
      proyectoConfig.fetch.LastId
    )
    try {
      return result.rows[0].lastid + 1
    } catch (error) {
      console.error(proyectoConfig.error.MaxIndex, error)
    }
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}
