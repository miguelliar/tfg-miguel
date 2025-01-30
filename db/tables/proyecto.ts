/* eslint-disable no-console */

"use server"

import type { ProyectoType } from "@/app/utils"

import config from "../constants.json"
import { getPool } from "../pool"

const proyectoConfig = config.proyecto
const pool = getPool()

export const searchProyectoByTitulo = async (
  query: string,
  page: number = 1,
  offset: number = 20
) => {
  if (!query || query.trim() === "") {
    throw new Error("The query must exist and cannot be empty")
  }
  if (page <= 0 || page > 300) {
    throw new Error("The page cannot be lower than 1 or greater than 300")
  }

  if (offset <= 0 || offset > 100) {
    throw new Error("The offset cannot be greater lower than 1 or greater than 100")
  }

  try {

    const limit = offset;
    const offsetValue = (page - 1) * offset;

    const result = await pool.query<ProyectoType>(
      proyectoConfig.search.SearchByName,
      [`%${query}%`, limit, offsetValue]
    )
    return result.rows
  } catch (error) {
    console.error(proyectoConfig.error.Executing, error)
  }
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

export const fetchJoinProyectosByInvestigadores = async (
  investigadoresEmail: string[]
) => {
  try {
    const result = await pool.query<ProyectoType>(
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
    const result = await pool.query<ProyectoType>(
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

  try {
    await pool.query(proyectoConfig.Create, [
      codigo,
      ip,
      coip,
      titulo,
      financiado,
      inicio,
      fin || null,
    ])
  } catch (error) {
    console.error(proyectoConfig.error.Inserting, error)
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
    throw new Error(
      "There doesn't exist any error with that codigo that can be updated"
    )
  }

  try {
    await pool.query(proyectoConfig.Update, [
      ip,
      coip,
      titulo,
      financiado,
      inicio,
      fin || null,
      codigo,
    ])
  } catch (error) {
    console.error(proyectoConfig.error.Updating, error)
  }
}
