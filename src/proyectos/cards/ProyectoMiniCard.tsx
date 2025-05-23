"use client"

import ShowMoreText from "react-show-more-text"

import { useQueryParam } from "@/utils/hooks/useQueryParam"

import type { ProyectoMinimumDataType } from "../types"

interface MiniCardProps {
  proyecto: ProyectoMinimumDataType
}

export const ProyectoMiniCard = ({ proyecto }: MiniCardProps) => {
  const { setQueryParam } = useQueryParam()

  return (
    <article className="flex flex-col justify-between border-2 border-primary rounded-md min-h-28">
      <div className="flex flex-col mt-1 text-center">
        <h2 className="text-accent-primary overflow-hidden text-ellipsis">
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
        className="bg-primary text-secondary hover:bg-primary-strong focus:bg-primary-strong transition-all"
        onClick={() => setQueryParam("codigo", proyecto.codigo)}
      >
        Ver detalles
      </button>
    </article>
  )
}
