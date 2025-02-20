"use client"

import { useState } from "react"

import { ProyectoCreateCard } from "../cards"

export const CreateProyectoButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="rounded-md border p-2 m-5 mt-1 border-gray-300 outline-2"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Crear Proyecto
      </button>
      {isOpen ? <ProyectoCreateCard onClose={() => setIsOpen(false)} /> : null}
    </>
  )
}
