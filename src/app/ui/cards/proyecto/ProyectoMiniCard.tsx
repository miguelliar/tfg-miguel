"use client"

import { useState } from "react"
import ShowMoreText from "react-show-more-text"

import type { ProyectoType } from "@/app/utils"

import { ProyectoCard } from "./ProyectoCard"

export const ProyectoMiniCard = ({ proyecto }: { proyecto: ProyectoType }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col justify-between border-2 border-font-color rounded-md min-h-28">
      <div className="flex flex-col mt-1 text-center">
        <h2 className="text-special-color">{proyecto.codigo}</h2>
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
        className="bg-font-color text-background-color"
        onClick={() => setOpen(true)}
      >
        Ver detalles
      </button>
      {open ? (
        <ProyectoCard proyecto={proyecto} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  )
}
