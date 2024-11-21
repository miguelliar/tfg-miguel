"use server"

import config from "../constants.json"
import { getPool } from "../pool"

const { participa } = config
const pool = getPool()

export async function createParticipa(
  emailInvestigador: string,
  codigoProyecto: string
) {
  try {
    await pool.query(participa.Create, [emailInvestigador, codigoProyecto])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Inserting, error)
  }
}
