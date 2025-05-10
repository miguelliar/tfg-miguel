"use server"

import { UserPlusIcon } from "@heroicons/react/24/solid"

import { InvestigadorCreateForm } from "@/app/ui"

export default async function Page() {
  return (
    <div className="flex flex-col items-center gap-5 my-2">
      <div className="flex flex-col sm:flex-row items-center">
        <UserPlusIcon className="w-9" />
        <h1 className="text-4xl text-center">Crear investigador</h1>
      </div>
      <InvestigadorCreateForm />
    </div>
  )
}
