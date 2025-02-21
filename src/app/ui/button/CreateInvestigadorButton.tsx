"use client"

import { PlusIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

import { InvestigadorCreateCard } from "../cards"

export const CreateInvestigadorButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="flex flex-row rounded-md border p-2 m-5 mt-1 border-gray-300 outline-2"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Añadir Investigador
        <PlusIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
      </button>
      {isOpen ? (
        <InvestigadorCreateCard onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  )
}
