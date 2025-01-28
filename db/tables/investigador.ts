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

const validateInputParameter = (investigador: InvestigadorType) => {
  const { email, nombre, apellidos, universidad, departamento, area, figura } =
    investigador

  if (!email || !email.trim()) return "Email cannot be empty"
  if (!nombre || !nombre.trim()) return "Nombre cannot be empty"
  if (!apellidos || !apellidos.trim()) return "Apellidos cannot be empty"
  if (!universidad || !universidad.trim()) return "Universidad cannot be empty"
  if (!departamento || !departamento.trim())
    return "Departamento cannot be empty"
  if (!area || !area.trim()) return "Area cannot be empty"
  if (!figura || !figura.trim()) return "Figura cannot be empty"
}

export const createInvestigador = async (investigador: InvestigadorType) => {
  const { email, nombre, apellidos, universidad, departamento, area, figura } =
    investigador

  const errorMessage = validateInputParameter(investigador)
  if (errorMessage) {
    throw new Error(errorMessage)
  }

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

export const updateInvestigador = async (investigador: InvestigadorType) => {
  const { email, nombre, apellidos, universidad, departamento, area, figura } =
    investigador

  const errorMessage = validateInputParameter(investigador)
  if (errorMessage) {
    throw new Error(errorMessage)
  }

  try {
    await pool.query(investigadorConfig.Update, [
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
      email,
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
