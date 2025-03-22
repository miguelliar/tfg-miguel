"use server"

import { InvestigadorCreateForm } from "@/app/ui"

export default async function Page() {
  return (
    <main>
      <h1 className="text-4xl m-5">Crear un investigador manualmente</h1>
      <InvestigadorCreateForm />
    </main>
  )
}
