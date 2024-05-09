import {Pool} from 'pg';
import * as dotenv from 'dotenv';

dotenv.configDotenv();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

export type InvestigadorType = {
    id: string;
    nombre_autor: string;
    universidad: string;
    departamento: string;
    area: string;
    figura: string;
    miembro: string;
}

export type ProyectoType = {
    id: string;
    codigo: string;
    ip: string;
    titulo: string;
    financiado: string;
    inicio: Date;
    fin: Date;
}

export const fetchInvestigadorData = async () => {
    try {
        const result = await pool.query<InvestigadorType>('SELECT * FROM investigador');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

export const fetchProjectData = async () => {
    try {
        const result = await pool.query<ProyectoType>('SELECT * FROM proyecto');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}