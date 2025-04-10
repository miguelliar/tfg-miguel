"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ShowMoreText from "react-show-more-text"

import type { ProyectoMinimumDataType } from "@/app/utils"

interface MiniCardProps {
  proyecto: ProyectoMinimumDataType
}

export const ProyectoMiniCard = ({ proyecto }: MiniCardProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const createPageURL = (codigo: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.set("codigo", codigo)
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex flex-col justify-between border-2 border-font-color rounded-md min-h-28">
      <div className="flex flex-col mt-1 text-center">
        <h2 className="text-special-color overflow-hidden text-ellipsis">
          {proyecto.codigo}
        </h2>
        <ShowMoreText
          lines={2}
          more={
            <button className="text-gray-500 text-sm" type="button">
              Más...
            </button>
          }
          less={
            <button className="text-gray-500 text-sm" type="button">
              ...Menos
            </button>
          }
        >
          <p>{proyecto.titulo}</p>
        </ShowMoreText>
      </div>
      <button
        type="button"
        className="bg-font-color text-background-color hover:bg-font-color-accent focus:bg-font-color-accent transition-all"
        onClick={() => {
          replace(createPageURL(proyecto.codigo))
        }}
      >
        Ver detalles
      </button>
    </div>
  )
}
