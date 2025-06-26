/* eslint-disable no-console */

"use server"

import { revalidatePath, unstable_noStore as noStore } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { DB_CONSTANTS, getPool } from "@/utils"

import participaConfig from "../../participa/db/constants.json"
import type { InvestigadorMinimumDataType, InvestigadorType } from "../types"
import config from "./constants.json"

const investigadorConfig = config
const pool = getPool()

const InvestigadorFormSchema = z.object({
  email: z.string(),
  nombre: z.string(),
  apellidos: z.string(),
  universidad: z.string(),
  departamento: z.string(),
  area: z.string(),
  figura: z.string(),
})

export async function createInvestigadorWithForm(formData: FormData) {
  const { email, nombre, apellidos, universidad, departamento, area, figura } =
    InvestigadorFormSchema.parse({
      email: formData.get("email"),
      nombre: formData.get("nombre"),
      apellidos: formData.get("apellidos"),
      universidad: formData.get("universidad"),
      departamento: formData.get("departamento"),
      area: formData.get("area"),
      figura: formData.get("figura"),
    })

  try {
    await pool.query(
      "INSERT INTO investigador (email, nombre, apellidos, universidad, departamento, area, figura) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [email, nombre, apellidos, universidad, departamento, area, figura]
    )
  } catch (error) {
    console.error("Error inserting proyecto", error)
  }
  revalidatePath("/investigadores", "page")
  redirect("/investigadores")
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
    await pool.query(DB_CONSTANTS.Start)
    await pool.query(investigadorConfig.Create, [
      email,
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
    ])
    await pool.query(DB_CONSTANTS.Commit)
    await pool.query(DB_CONSTANTS.End)
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
    await pool.query(DB_CONSTANTS.Start)
    await pool.query(investigadorConfig.Update, [
      nombre,
      apellidos,
      universidad,
      departamento,
      area,
      figura,
      email,
    ])
    await pool.query(DB_CONSTANTS.Commit)
    await pool.query(DB_CONSTANTS.End)
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
    await pool.query(DB_CONSTANTS.Start)
    const deleteParticipaStatus = await pool.query(
      participaConfig.delete.ByEmail,
      [email]
    )
    const deleteInvestigadorStatus = await pool.query(
      investigadorConfig.Delete,
      [email]
    )
    await pool.query(DB_CONSTANTS.Commit)
    await pool.query(DB_CONSTANTS.End)

    const columnsAffected =
      (deleteParticipaStatus.rowCount ?? 0) +
      (deleteInvestigadorStatus.rowCount ?? 0)

    return Boolean(columnsAffected)
  } catch (error) {
    console.error(error)
  }
}
