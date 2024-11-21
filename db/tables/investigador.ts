/* eslint-disable no-console */

"use server"

import config from "../constants.json"
import { getPool } from "../pool"

const investigadorConfig = config.investigador
const pool = getPool()

export type InvestigadorType = {
  email: string
  nombre: string
  apellidos: string
  universidad: string
  departamento: string
  area: string
  figura: string
}

export const createInvestigador = async (investigador: InvestigadorType) => {
  const { email, nombre, apellidos, universidad, departamento, area, figura } =
    investigador
  try {
    await pool.query(investigadorConfig.Create, [
      email,
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
    ])
  } catch (error) {
    console.error(investigadorConfig.error.Inserting, error)
  }
}

export const fetchInvestigadorData = async () => {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.All
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadorByEmail = async (email: string) => {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.ByEmail,
      [email]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadoresByProyecto = async (codigo: string) => {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.ByProyectoCode,
      [codigo]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadoresByNombre = async (nombre: string) => {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.ByLikeNombreAutor,
      [`%${nombre}%`]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export async function fetchInvestigadorByNombreAutor(nombreAutor: string) {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.ByNombreAutor,
      [nombreAutor]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}
