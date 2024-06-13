'use server';

import { z } from 'zod';
import {Pool} from 'pg';
import {configDotenv} from 'dotenv';
import { revalidatePath } from 'next/cache';

configDotenv();

const pool = new Pool({
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

const ProyectoFormSchema = z.object({
    codigo: z.string(),
    ip: z.string(),
    titulo: z.string(),
    financiado: z.string(),
    inicio: z.string(),
    fin: z.string(),
})

export const fetchFilteredInvestigador =  async (idProyecto: string) => {
    try {
        const result = await pool.query<InvestigadorType>(
            `SELECT * FROM investigador WHERE investigador.id IN (SELECT id_investigador FROM participa WHERE id_proyecto='${idProyecto}')`
        );
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
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

export async function createProyecto(formData: FormData) {
    const { codigo, ip, titulo, financiado, inicio, fin } = ProyectoFormSchema.parse({
        codigo: formData.get('codigo'),
        ip: formData.get('ip'),
        titulo: formData.get('titulo'),
        financiado: formData.get('financiado'),
        inicio: formData.get('inicio'),
        fin: formData.get('fin'),
    });
    const id = (await fetchLastProyectoId())?.lastid;

    try {
        await pool.query(`INSERT INTO proyecto (id, codigo, ip, titulo, financiado, inicio, fin)
        VALUES ('${id}', '${codigo}', '${ip}', '${titulo}', '${financiado}', '${inicio}', ${ fin ? '\''+fin+'\'' : 'NULL'} )`)
    } catch (error) {
        console.error('Error inserting proyecto', error);
    }
    revalidatePath('/proyectos');
}

const fetchLastProyectoId = async () => {
    try {
        const result = await pool.query<{lastid: number}>(`SELECT
        MAX(CAST(id AS INT)) as lastId
    FROM proyecto
    WHERE id LIKE '%'`);
    try {
        return result.rows[0];
    } catch (error) {
        console.error('Error obtaining the maximum index', error);
    }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

export const fetchInvestigadoresByProyecto = async (id: string) => {
    try {
        const result = await pool.query<InvestigadorType>('SELECT * FROM investigador WHERE id in (SELECT * FROM participa WHERE id_proyecto = $1)', [id]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}
