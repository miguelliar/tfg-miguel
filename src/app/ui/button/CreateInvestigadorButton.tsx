"use client"

import { PlusIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

import { InvestigadorCreateCard } from "../cards"
import { Button } from "./Button"

export const CreateInvestigadorButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Añadir Investigador
        <PlusIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
      </Button>
      {isOpen ? (
        <InvestigadorCreateCard onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  )
}
