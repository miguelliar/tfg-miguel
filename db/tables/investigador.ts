/* eslint-disable no-console */

"use server"

import { unstable_noStore as noStore } from "next/cache"

import type { InvestigadorMinimumDataType } from "@/app/utils"

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

  const existingInvestigador = await fetchInvestigadorByEmail(email)
  if (existingInvestigador) {
    throw new Error(investigadorConfig.error.add.Duplicated)
  }

  try {
    await pool.query(config.transaction.Start)
    await pool.query(investigadorConfig.Create, [
      email,
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    console.error(investigadorConfig.error.add.Standard, error)
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
    await pool.query(config.transaction.Start)
    await pool.query(investigadorConfig.Update, [
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
      email,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    console.error(investigadorConfig.error.Update, error)
  }
}

export const fetchInvestigadorData = async (
  page: number = investigadorConfig.pagination.INITIAL_PAGE,
  offset: number = investigadorConfig.pagination.ITEMS_PER_PAGE
) => {
  if (page <= 0 || page > 300) {
    throw new Error("The page cannot be lower than 1 or greater than 300")
  }

  if (offset <= 0 || offset > 100) {
    throw new Error("The offset cannot be lower than 1 or greater than 100")
  }

  try {
    const limit = offset
    const offsetValue = (page - 1) * offset

    const result = await pool.query<InvestigadorMinimumDataType>(
      investigadorConfig.fetch.AllMinimumData,
      [limit, offsetValue]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadoresByQuery = async (
  query: string,
  page: number = investigadorConfig.pagination.INITIAL_PAGE,
  offset: number = investigadorConfig.pagination.ITEMS_PER_PAGE
) => {
  noStore()
  if (!query || query.trim() === "") {
    throw new Error("The query must exist and cannot be empty")
  }
  if (page <= 0 || page > 300) {
    throw new Error("The page cannot be lower than 1 or greater than 300")
  }

  if (offset <= 0 || offset > 100) {
    throw new Error(
      "The offset cannot be greater lower than 1 or greater than 100"
    )
  }

  try {
    const limit = offset
    const offsetValue = (page - 1) * offset

    const result = await pool.query<InvestigadorMinimumDataType>(
      investigadorConfig.search.SearchByMinimumData,
      [`%${query}%`, limit, offsetValue]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadoresNotParticipatingInProject = async (
  query: string,
  code: string
) => {
  noStore()
  if (!query || query.trim() === "") {
    throw new Error("The query must exist and cannot be empty")
  }
  if (!code || code.trim() === "") {
    throw new Error("The code must exist and cannot be empty")
  }

  try {
    const result = await pool.query<InvestigadorMinimumDataType>(
      investigadorConfig.search.SearchInvestigadoresNotParticipating,
      [`%${query}%`, code]
    )
    return result.rows
  } catch (error) {
    console.error(investigadorConfig.error.Executing, error)
  }
}

export const fetchInvestigadorTotalPages = async (query: string) => {
  noStore()
  try {
    const count = await pool.query<{ count: number }>(
      investigadorConfig.search.MaxNumberOfPages,
      [`%${query}%`]
    )

    const totalPages = Math.ceil(
      Number(count.rows[0].count) / investigadorConfig.pagination.ITEMS_PER_PAGE
    )
    return totalPages
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch total number of invoices.")
  }
}

export const fetchInvestigadorByEmail = async (
  email: string
): Promise<InvestigadorType | undefined> => {
  try {
    const result = await pool.query<InvestigadorType>(
      investigadorConfig.fetch.ByEmail,
      [email]
    )
    return result.rows[0]
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

export async function deleteInvestigador(email: string) {
  try {
    const proyecto = await fetchInvestigadorByEmail(email)
    if (!proyecto) {
      throw new Error(investigadorConfig.error.delete.email)
    }
    await pool.query(config.transaction.Start)
    const deleteParticipaStatus = await pool.query(
      config.participa.delete.ByEmail,
      [email]
    )
    const deleteInvestigadorStatus = await pool.query(
      investigadorConfig.Delete,
      [email]
    )
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)

    const columnsAffected =
      (deleteParticipaStatus.rowCount ?? 0) +
      (deleteInvestigadorStatus.rowCount ?? 0)

    return Boolean(columnsAffected)
  } catch (error) {
    console.error(error)
  }
}
