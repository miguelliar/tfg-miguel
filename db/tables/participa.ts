"use server"

import config from "../constants.json"
import { getPool } from "../pool"

const { participa } = config
const pool = getPool()

export async function createParticipa(
  idProyecto: number,
  idInvestigador: number
) {
  try {
    await pool.query(participa.Create, [idInvestigador, idProyecto])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(participa.error.Inserting, error)
  }
}
