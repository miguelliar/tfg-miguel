"use server"

import type { FormParams } from "@/app/ui"
import { CreateForm } from "@/app/ui"
import { investigadorFields } from "@/app/utils"
import { createInvestigadorWithForm } from "@/db"

export default async function Page() {
  const formParams: FormParams = {
    submitCallback: createInvestigadorWithForm,
    fields: investigadorFields,
    submitText: "Crear investigador",
  }

  return (
    <main>
      <h1 className="text-4xl m-5">Crear un investigador manualmente</h1>
      <CreateForm {...formParams} />
    </main>
  )
}
