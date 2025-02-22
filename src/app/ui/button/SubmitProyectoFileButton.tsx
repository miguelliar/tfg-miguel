"use client"

import { ArrowUpTrayIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"

export const SubmitProyectoFileButton = () => {
  const router = useRouter()

  return (
    <button
      className="flex flex-row rounded-md border p-2 mr-5 mb-5 mt-1 border-gray-300 outline-2"
      type="button"
      onClick={() => router.push("/proyectos/crear/subida")}
    >
      Subir Archivo
      <ArrowUpTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
    </button>
  )
}
