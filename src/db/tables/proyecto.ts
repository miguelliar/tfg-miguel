/* eslint-disable no-console */

"use server"

import { unstable_noStore as noStore } from "next/cache"

import type { ProyectoMinimumDataType, ProyectoType } from "@/proyectos"

import config from "../constants.json"
import { getPool } from "../pool"

const proyectoConfig = config.proyecto
const pool = getPool()

export const fetchCodeAndTitleProyectoData = async (
  page: number = proyectoConfig.pagination.INITIAL_PAGE,
  offset: number = proyectoConfig.pagination.ITEMS_PER_PAGE
) => {
  if (page <= 0 || page > 300) {
    throw new Error("The page cannot be lower than 1 or greater than 300")
  }

  try {
    const limit = offset
    const offsetValue = (page - 1) * offset

    const result = await pool.query<ProyectoMinimumDataType>(
      proyectoConfig.fetch.AllMinimumData,
      [limit, offsetValue]
    )

    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchCodeAndTitleProyectoByQuery = async (
  query: string,
  page: number = proyectoConfig.pagination.INITIAL_PAGE,
  offset: number = proyectoConfig.pagination.ITEMS_PER_PAGE
) => {
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

    const result = await pool.query<ProyectoMinimumDataType>(
      proyectoConfig.search.SearchMinimumData,
      [`%${query}%`, limit, offsetValue]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchProyectoByQuery = async (
  query: string,
  page: number = proyectoConfig.pagination.INITIAL_PAGE,
  offset: number = proyectoConfig.pagination.ITEMS_PER_PAGE
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

    const result = await pool.query<ProyectoType>(
      proyectoConfig.search.SearchByName,
      [`%${query}%`, limit, offsetValue]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchProyectoTotalPages = async (query: string) => {
  noStore()
  try {
    const count = await pool.query<{ count: number }>(
      proyectoConfig.search.MaxNumberOfPages,
      [`%${query}%`]
    )

    const totalPages = Math.ceil(
      Number(count.rows[0].count) / proyectoConfig.pagination.ITEMS_PER_PAGE
    )
    return totalPages
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch total number of invoices.")
  }
}

export const fetchProyectoData = async (
  page: number = proyectoConfig.pagination.INITIAL_PAGE,
  offset: number = proyectoConfig.pagination.ITEMS_PER_PAGE
) => {
  if (page <= 0 || page > 300) {
    throw new Error("The page cannot be lower than 1 or greater than 300")
  }

  try {
    const limit = offset
    const offsetValue = (page - 1) * offset

    const result = await pool.query<ProyectoType>(proyectoConfig.fetch.All, [
      limit,
      offsetValue,
    ])

    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchProyectosByCodigos = async (emails: string[]) => {
  try {
    const result = await pool.query<ProyectoType>(
      proyectoConfig.fetch.ByCodigos,
      [emails]
    )
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
    const result = await pool.query<ProyectoMinimumDataType>(
      proyectoConfig.fetch.AllByInvestigadores,
      [investigadoresEmail]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchJoinProyectosByInvestigadores = async (
  investigadoresEmail: string[]
) => {
  try {
    const result = await pool.query<ProyectoMinimumDataType>(
      proyectoConfig.fetch.JoinByInvestigadores,
      [investigadoresEmail]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

export const fetchDistinctProyectosByInvestigadores = async (
  investigadoresEmail: string[]
) => {
  try {
    const result = await pool.query<ProyectoMinimumDataType>(
      proyectoConfig.fetch.DistinctProyectosByInvestigadores,
      [investigadoresEmail]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
}

const validateInputParameter = (proyecto: ProyectoType) => {
  const { codigo, ip, titulo, financiado, inicio, fin } = proyecto

  if (!codigo || !codigo.trim()) return "Codigo cannot be empty"
  if (!ip || !ip.trim()) return "Investigador principal cannot be empty"
  if (!titulo || !titulo.trim()) return "Titulo cannot be empty"
  if (!financiado || !financiado.trim()) return "Financiado cannot be empty"
  if (!inicio) return "Inicio cannot be empty"
  if (fin && fin?.valueOf() < inicio.valueOf())
    return "Fin date must be after inicio date"
}

export async function createProyectoItem(proyecto: ProyectoType) {
  const { codigo, ip, coip, titulo, financiado, inicio, fin } = proyecto

  const errorMessage = validateInputParameter(proyecto)

  if (errorMessage) {
    throw new Error(errorMessage)
  }

  const existingProyecto = await fetchProyectoByCode(codigo)

  if (existingProyecto) {
    throw new Error(proyectoConfig.error.add.Duplicated)
  }

  try {
    await pool.query(config.transaction.Start)
    await pool.query(proyectoConfig.Create, [
      codigo,
      ip,
      coip,
      titulo,
      financiado,
      inicio,
      fin || null,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    throw new Error("Ha habido un error añadiendo el proyecto")
  }
}

export async function updateProyectoItem(proyecto: ProyectoType) {
  const { codigo, ip, coip, titulo, financiado, inicio, fin } = proyecto

  const errorMessage = validateInputParameter(proyecto)
  if (errorMessage) {
    throw new Error(errorMessage)
  }

  const proyectoOriginal = await fetchProyectoByCode(codigo)
  if (!proyectoOriginal) {
    throw new Error(proyectoConfig.error.update.Inexisting)
  }

  try {
    await pool.query(config.transaction.Start)
    await pool.query(proyectoConfig.Update, [
      ip,
      coip,
      titulo,
      financiado,
      inicio,
      fin || null,
      codigo,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    console.error(proyectoConfig.error.update.Standard, error)
  }
}

export async function deleteProyecto(codigo: string) {
  try {
    const proyecto = await fetchProyectoByCode(codigo)
    if (!proyecto) {
      throw new Error(proyectoConfig.error.delete.code)
    }
    await pool.query(config.transaction.Start)
    const deleteParticipaStatus = await pool.query(
      config.participa.delete.ByCodigo,
      [codigo]
    )
    const deleteProyectoStatus = await pool.query(proyectoConfig.Delete, [
      codigo,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)

    const columnsAffected =
      (deleteParticipaStatus.rowCount ?? 0) +
      (deleteProyectoStatus.rowCount ?? 0)

    return Boolean(columnsAffected)
  } catch (error) {
    console.error(error)
  }
}
