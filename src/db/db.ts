/* eslint-disable no-console */

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { getPool } from "./pool"

const pool = getPool()

const ProyectoFormSchema = z.object({
  codigo: z.string(),
  ip: z.string(),
  coip: z.optional(z.string()),
  titulo: z.string(),
  financiado: z.string(),
  inicio: z.string(),
  fin: z.optional(z.string()),
})

export async function createProyecto(formData: FormData) {
  const { codigo, ip, coip, titulo, financiado, inicio, fin } =
    ProyectoFormSchema.parse({
      codigo: formData.get("codigo"),
      ip: formData.get("ip"),
      coip: formData.get("coip"),
      titulo: formData.get("titulo"),
      financiado: formData.get("financiado"),
      inicio: formData.get("inicio"),
      fin: formData.get("fin"),
    })

  try {
    await pool.query(
      "INSERT INTO proyecto (codigo, ip, coip, titulo, financiado, inicio, fin) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [codigo, ip, coip || null, titulo, financiado, inicio, fin || null]
    )
  } catch (error) {
    console.error("Error inserting proyecto", error)
  }
  revalidatePath("/proyectos")
  redirect("/proyectos")
}
