"use server"

import type { CreateFormParams } from "@/app/ui"
import { CreateForm } from "@/app/ui"
import { createProyecto } from "@/db"

import fields from "./constants.json"

export default async function Page() {
  const formParams: CreateFormParams = {
    createCallback: createProyecto,
    fields,
    submitText: "Crear proyecto",
  }

  return (
    <main>
      <h1>Crear un proyecto manualmente</h1>
      <CreateForm {...formParams} />
    </main>
  )
}
