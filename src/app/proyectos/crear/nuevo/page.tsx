"use server"

import { DocumentPlusIcon } from "@heroicons/react/24/solid"

import { ProyectoCreate } from "@/proyectos"

export default async function Page() {
  return (
    <div className="flex flex-col items-center gap-5 my-2">
      <div className="flex flex-row gap-3">
        <DocumentPlusIcon className="w-9" />
        <h1 className="text-4xl text-center">Crear proyecto</h1>
      </div>
      <ProyectoCreate />
    </div>
  )
}
