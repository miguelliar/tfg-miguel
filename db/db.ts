'use server';

import { z } from 'zod';
import {Pool} from 'pg';
import {configDotenv} from 'dotenv';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

const InvestigadorFormSchema = z.object({
    nombre_autor: z.string(),
    universidad: z.string(),
    departamento: z.string(),
    area: z.string(),
    figura: z.string(),
    miembro: z.string(),
})

export const fetchFilteredInvestigador =  async (code: string) => {
    try {
        const result = await pool.query<InvestigadorType>(
            'SELECT * FROM investigador WHERE investigador.id IN (SELECT id_investigador FROM participa WHERE id_proyecto IN (SELECT id FROM proyecto WHERE codigo=$1))',
            [code]
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

export const fetchProyectoData = async () => {
    try {
        const result = await pool.query<ProyectoType>('SELECT * FROM proyecto');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

export const fetchProyectoByCode = async (code: string) => {
    try {
        const result = await pool.query<ProyectoType>('SELECT * FROM proyecto WHERE codigo=$1', [code]);
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving proyecto', error);
    }
}

export async function createProyectoItem(proyecto: ProyectoType) {
    const {codigo, ip, titulo, financiado, inicio, fin} = proyecto;

    const id = (await fetchLastAvailableProyectoId());

    try {
        await pool.query('INSERT INTO proyecto (id, codigo, ip, titulo, financiado, inicio, fin) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
        [id, codigo, ip, titulo, financiado, inicio, fin ?? 'NULL']);

        return id;
    } catch (error) {
        console.error('Error inserting proyecto', error);
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
    const id = (await fetchLastAvailableProyectoId());

    try {
        await pool.query('INSERT INTO proyecto (id, codigo, ip, titulo, financiado, inicio, fin) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
        [id, codigo, ip, titulo, financiado, inicio, fin ?? 'NULL'])
    } catch (error) {
        console.error('Error inserting proyecto', error);
    }
    revalidatePath('/proyectos');
    redirect('/proyectos');
}

export async function createInvestigador(formData: FormData) {
    const {nombre_autor, universidad, departamento, area, figura, miembro} = InvestigadorFormSchema.parse({
        nombre_autor: formData.get('nombre_autor'),
        universidad: formData.get('universidad'),
        departamento: formData.get('departamento'),
        area: formData.get('area'),
        figura: formData.get('figura'),
        miembro: formData.get('miembro'),
    })

    const id = (await fetchLastAvailableInvestigadorId());

    try {
        await pool.query(
            'INSERT INTO investigador (id, nombre_autor, universidad, departamento, area, figura, miembro) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, nombre_autor, universidad, departamento, area, figura, miembro]);
    } catch (error) {
        console.error('Error inserting proyecto', error);
    }
    revalidatePath('/investigadores', 'page');
    redirect('/investigadores');
}

export async function createParticipa(idProyecto: number, idInvestigador: number) {
    try {
        await pool.query('INSERT INTO participa (id_investigador, id_proyecto) VALUES ($1, $2)', [idInvestigador, idProyecto])
    } catch (error) {
        console.error('Error inserting participa', error);
    }
    revalidatePath('/proyectos', 'page');
}

const fetchLastAvailableProyectoId = async () => {
    try {
        const result = await pool.query<{lastid: number}>(`SELECT
            MAX(CAST(id AS INT)) as lastId
        FROM proyecto
        WHERE id LIKE '%'`);
        try {
            return result.rows[0].lastid + 1;
        } catch (error) {
            console.error('Error obtaining the maximum index', error);
        }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

const fetchLastAvailableInvestigadorId = async () => {
    try {
        const result = await pool.query<{lastid: number}>(`SELECT
        MAX(CAST(id AS INT)) as lastId
    FROM investigador
    WHERE id LIKE '%'`);
    try {
        return result.rows[0].lastid + 1;
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

export const fetchInvestigadoresByNombre = async (nombre: string) => {
    try {
        const result = await pool.query<InvestigadorType>(`SELECT * FROM investigador WHERE nombre_autor ILIKE $1`, [`%${nombre}%`]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

export async function fetchInvestigadorByNombreAutor(nombreAutor: string) {
    try {
        const result = await pool.query<InvestigadorType>('SELECT * FROM investigador WHERE nombre_autor = $1', [nombreAutor]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}
