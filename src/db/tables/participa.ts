"use server"

import { unstable_noStore as noStore } from "next/cache"

import type { ParticipaType } from "@/app/utils"

import config from "../constants.json"
import { getPool } from "../pool"
import { fetchInvestigadorByEmail } from "./investigador"
import { fetchProyectoByCode } from "./proyecto"

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

export async function deleteParticipa(codigo: string, email: string) {
  noStore()
  try {
    await pool.query(config.transaction.Start)
    await pool.query(participa.delete.ByPK, [codigo, email])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Delete, error)
  }
}

export async function createParticipa(
  emailInvestigador: string,
  codigoProyecto: string,
  nombreAutor: string
) {
  const investigadorExists = await fetchInvestigadorByEmail(emailInvestigador)

  if (!investigadorExists) {
    throw new Error(participa.error.add.Investigador)
  }

  const proyectoExists = await fetchProyectoByCode(codigoProyecto)

  if (!proyectoExists) {
    throw new Error(participa.error.add.Proyecto)
  }

  const duplicatedParticipa = await fetchParticipa(
    codigoProyecto,
    emailInvestigador
  )

  if (duplicatedParticipa) {
    throw new Error(participa.error.add.Duplicated)
  }

  try {
    await pool.query(config.transaction.Start)
    await pool.query(participa.Create, [
      emailInvestigador,
      codigoProyecto,
      nombreAutor,
    ])
    await pool.query(config.transaction.Commit)
    await pool.query(config.transaction.End)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.add.Standard, error)
  }
}
