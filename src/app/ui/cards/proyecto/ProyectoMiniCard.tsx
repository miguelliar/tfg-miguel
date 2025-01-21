"use client"

import { useState } from "react"

import type { ProyectoType } from "@/app/utils"

import { ProyectoCard } from "./ProyectoCard"

export const ProyectoMiniCard = ({ proyecto }: { proyecto: ProyectoType }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col justify-between border-2 border-font-color rounded-md min-h-28">
      <div className="flex flex-row justify-center mt-1 text-special-color">
        <h2>{proyecto.codigo}</h2>
      </div>
      <div className="my-1 mx-3">
        <p className="flex flex-nowrap">
          <b>I.P: </b>
          <span className="text-ellipsis overflow-hidden text-nowrap">
            {proyecto.ip}
          </span>
        </p>
        {proyecto.coip && (
          <p>
            <b>Co I.P: </b>
            {proyecto.coip}
          </p>
        )}
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
