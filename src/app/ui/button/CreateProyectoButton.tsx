"use client"

import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover"
import { useState } from "react"

import { ProyectoCreateCard } from "../cards"
import { ProyectoSubmitCard } from "../cards/proyecto/SubmitCard"

export const CreateProyectoButton = () => {
  const [isIndividualAddOpen, setIsIndividualAddOpen] = useState(false)
  const [isFileAddOpen, setIsFileAddOpen] = useState(false)

  return (
    <>
      <Popover color="primary" placement="top-start">
        <PopoverTrigger>
          <button
            className="flex flex-row rounded-md border p-2 m-5 mt-1 border-gray-300 outline-2"
            type="button"
          >
            Añadir Proyecto
            <PlusIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="px-0 py-0">
          <div className="flex flex-col rounded-md items-start">
            <button
              className="pl-2 p-1"
              type="button"
              onClick={() => setIsIndividualAddOpen(true)}
            >
              Individualmente
            </button>
            <button
              className="flex flex-row pl-2 p-1"
              type="button"
              onClick={() => setIsFileAddOpen(true)}
            >
              Por archivo
              <ArrowUpTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {isIndividualAddOpen ? (
        <ProyectoCreateCard onClose={() => setIsIndividualAddOpen(false)} />
      ) : null}
      {isFileAddOpen ? (
        <ProyectoSubmitCard onClose={() => setIsFileAddOpen(false)} />
      ) : null}
    </>
  )
}
