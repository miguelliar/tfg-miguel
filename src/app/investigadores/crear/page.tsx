"use server"

import type { CreateFormParams } from "@/app/ui"
import { CreateForm } from "@/app/ui"
import { createInvestigadorWithForm } from "@/db"

import { fields } from "./constants.json"

export default async function Page() {
  const formParams: CreateFormParams = {
    createCallback: createInvestigadorWithForm,
    fields,
    submitText: "Crear investigador",
  }

  return <CreateForm {...formParams} />
}
