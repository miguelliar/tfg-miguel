'use server'

import { getPool } from "../pool";
import { participa } from "../constants.json";

const pool = getPool();

export async function createParticipa(idProyecto: number, idInvestigador: number) {
    try {
        await pool.query(participa.Create, [idInvestigador, idProyecto])
    } catch (error) {
        console.error(participa.error.Inserting, error);
    }
}