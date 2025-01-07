/* eslint-disable no-console */

"use server"

import config from "../constants.json"
import { getPool } from "../pool"

const proyectoConfig = config.proyecto
const pool = getPool()

export type ProyectoType = {
  codigo: string
  ip: string
  coip: string
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

export const fetchAllProyectosByInvestigadores = async (
  investigadoresEmail: string[]
) => {
  try {
    const result = await pool.query<ProyectoType>(
      proyectoConfig.fetch.AllByInvestigadores,
      [investigadoresEmail]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export async function createProyectoItem(proyecto: ProyectoType) {
  const { codigo, ip, coip, titulo, financiado, inicio, fin } = proyecto

  try {
    await pool.query(proyectoConfig.Create, [
      codigo,
      ip,
      coip,
      titulo,
      financiado,
      inicio,
      fin ?? "NULL",
    ])
  } catch (error) {
    console.error(proyectoConfig.error.Inserting, error)
  }
}
