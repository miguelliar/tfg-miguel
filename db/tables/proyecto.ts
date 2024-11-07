'use server'

import { getPool } from "../pool";
import { proyecto as query} from "../constants.json";

const pool = getPool();

export type ProyectoType = {
    id: string;
    codigo: string;
    ip: string;
    titulo: string;
    financiado: string;
    inicio: Date;
    fin: Date;
}

export const fetchProyectoData = async () => {
    try {
        const result = await pool.query<ProyectoType>(query.fetch.All);
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export const fetchProyectoByCode = async (code: string) => {
    try {
        const result = await pool.query<ProyectoType>(query.fetch.ByCodigo, [code]);
        return result.rows[0];
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export async function createProyectoItem(proyecto: ProyectoType) {
    const {codigo, ip, titulo, financiado, inicio, fin} = proyecto;

    const id = (await fetchLastAvailableProyectoId());

    try {
        await pool.query(query.Create, 
        [id, codigo, ip, titulo, financiado, inicio, fin ?? 'NULL']);

        return id;
    } catch (error) {
        console.error(query.error.Inserting, error);
    }
}

export const fetchLastAvailableProyectoId = async () => {
    try {
        const result = await pool.query<{lastid: number}>(query.fetch.LastId);
        try {
            return result.rows[0].lastid + 1;
        } catch (error) {
            console.error(query.error.MaxIndex, error);
        }
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}
