"use server"

import { InvestigadorCreateForm } from "@/app/ui"

export default async function Page() {
  return (
    <div className="flex flex-col items-center gap-5 my-2">
      <h1 className="text-4xl text-center">Crear investigador</h1>
      <InvestigadorCreateForm />
    </div>
  )
}
