"use server"

import type { CreateFormParams } from "@/app/ui"
import { CreateForm } from "@/app/ui"
import { proyectoFields } from "@/app/utils"
import { createProyecto } from "@/db"

export default async function Page() {
  const formParams: CreateFormParams = {
    submitCallback: createProyecto,
    fields: proyectoFields,
    submitText: "Crear proyecto",
  }

  return (
    <main>
      <h1>Crear un proyecto manualmente</h1>
      <CreateForm {...formParams} />
    </main>
  )
}
