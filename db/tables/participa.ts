"use server"

import { unstable_noStore as noStore } from "next/cache"

import type { ParticipaType } from "@/app/utils"

import config from "../constants.json"
import { getPool } from "../pool"

const { participa } = config
const pool = getPool()

type ParticipaDBType = {
  codigo_proyecto: string
  email_investigador: string
  nombre_autor: string
}

export async function fetchNombresDeAutor(email: string) {
  noStore()
  try {
    const result = await pool.query<{ nombre_autor: string }>(
      participa.fetch.NombreDeAutor,
      [email]
    )

    return result.rows.map((value) => value.nombre_autor)
  } catch (error) {
    throw new Error(participa.error.Fetch)
  }
}

export async function fetchParticipaByCodigoProyecto(codigoProyecto: string) {
  noStore()
  try {
    const result = await pool.query<ParticipaDBType>(participa.fetch.ByCodigo, [
      codigoProyecto,
    ])
    return result.rows.map(
      (participa): ParticipaType => ({
        codigo: participa.codigo_proyecto,
        email: participa.email_investigador,
        nombreAutor: participa.nombre_autor,
      })
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Fetch, error)
  }
}

export async function fetchParticipaByEmailInvestigador(email: string) {
  noStore()
  try {
    const result = await pool.query<ParticipaDBType>(
      participa.fetch.ByEmailInvestigador,
      [email]
    )
    return result.rows.map(
      (participa): ParticipaType => ({
        codigo: participa.codigo_proyecto,
        email: participa.email_investigador,
        nombreAutor: participa.nombre_autor,
      })
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Fetch, error)
  }
}

export async function fetchParticipa(codigo: string, email: string) {
  noStore()
  try {
    const result = await pool.query<ParticipaDBType>(
      participa.fetch.ByCodigoAndEmail,
      [codigo, email]
    )

    const participaResult = result.rows[0]

    if (!participaResult) return null

    return {
      codigo: participaResult.codigo_proyecto,
      email: participaResult.email_investigador,
      nombreAutor: participaResult.nombre_autor,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Fetch, error)
  }
}

// TODO: handle delete as a transaction
export async function deleteParticipa(codigo: string, email: string) {
  noStore()
  try {
    await pool.query(participa.delete.ByPK, [codigo, email])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Delete, error)
  }
}

// TODO: handle add as a transaction
export async function createParticipa(
  emailInvestigador: string,
  codigoProyecto: string,
  nombreAutor: string
) {
  try {
    await pool.query(participa.Create, [
      emailInvestigador,
      codigoProyecto,
      nombreAutor,
    ])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Inserting, error)
  }
}
