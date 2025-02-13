"use server"

import type { FormParams } from "@/app/ui"
import { CreateForm } from "@/app/ui"
import { proyectoFields } from "@/app/utils"
import { createProyecto } from "@/db"

export default async function Page() {
  const formParams: FormParams = {
    submitCallback: createProyecto,
    fields: proyectoFields,
    submitText: "Crear proyecto",
  }

  return (
    <main>
      <h1 className="text-4xl m-5">Crear un proyecto manualmente</h1>
      <CreateForm {...formParams} />
    </main>
  )
}
