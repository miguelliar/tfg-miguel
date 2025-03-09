"use server"

import { unstable_noStore as noStore } from "next/cache"
import config from "../constants.json"
import { getPool } from "../pool"
import { ParticipaType as ParticipaType } from "@/app/utils"

const { participa } = config
const pool = getPool()

type ParticipaDBType = {
  codigo_proyecto: string
  email_investigador: string
  nombre_autor: string
}

export async function fetchParticipaByCodigoProyecto(codigoProyecto: string) {
  noStore()
  try {
    const result = await pool.query<ParticipaDBType>(participa.Create, [codigoProyecto])
    return result.rows.map((participa) : ParticipaType => ({codigo: participa.codigo_proyecto, email: participa.email_investigador, nombreAutor: participa.nombre_autor}))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Inserting, error)
  }
}

export async function createParticipa(
  emailInvestigador: string,
  codigoProyecto: string,
  nombreAutor: string
) {
  try {
    await pool.query(participa.Create, [emailInvestigador, codigoProyecto, nombreAutor])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Inserting, error)
  }
}
