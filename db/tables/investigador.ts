'use server'

import {investigador as query} from "../constants.json";
import { getPool } from "../pool";

const pool = getPool();

export type InvestigadorType = {
    id: string;
    nombre_autor: string;
    universidad: string;
    departamento: string;
    area: string;
    figura: string;
    miembro: string;
}

export const createInvestigador = async (investigador: InvestigadorType) => {
    const {id, nombre_autor, universidad, departamento, area, figura, miembro} = investigador;
    try {
        await pool.query(
            query.Create,
            [id, nombre_autor, universidad, departamento, area, figura, miembro]);
    } catch (error) {
        console.error(query.error.Inserting, error);
    }
}

export const fetchInvestigadorByProyectoCode =  async (code: string) => {
    try {
        const result = await pool.query<InvestigadorType>(
            query.fetch.ByProyectoCode,
            [code]
        );
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export const fetchInvestigadorData = async () => {
    try {
        const result = await pool.query<InvestigadorType>(query.fetch.All);
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export const fetchInvestigadoresByProyecto = async (id: string) => {
    try {
        const result = await pool.query<InvestigadorType>(query.fetch.ByProyectoId, [id]);
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export const fetchInvestigadoresByNombre = async (nombre: string) => {
    try {
        const result = await pool.query<InvestigadorType>(query.fetch.ByLikeNombreAutor, [`%${nombre}%`]);
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export async function fetchInvestigadorByNombreAutor(nombreAutor: string) {
    try {
        const result = await pool.query<InvestigadorType>(query.fetch.ByNombreAutor, [nombreAutor]);
        return result.rows;
    } catch (error) {
        console.error(query.error.Executing, error);
    }
}

export const fetchLastAvailableInvestigadorId = async () => {
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
