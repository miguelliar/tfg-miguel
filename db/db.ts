'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchLastAvailableInvestigadorId } from './tables/investigador';
import { fetchLastAvailableProyectoId } from './tables/proyecto';
import { getPool } from './pool';

const pool = getPool() ;

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

export async function createInvestigadorWithForm(formData: FormData) {
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

export async function createParticipaWithForm(idProyecto: number, idInvestigador: number) {
    try {
        await pool.query('INSERT INTO participa (id_investigador, id_proyecto) VALUES ($1, $2)', [idInvestigador, idProyecto])
    } catch (error) {
        console.error('Error inserting participa', error);
    }
    revalidatePath('/proyectos', 'page');
}
