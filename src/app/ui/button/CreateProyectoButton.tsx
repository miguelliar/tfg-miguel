"use client"

import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

import { ProyectoCreateCard } from "../cards"
import { ProyectoSubmitCard } from "../cards/proyecto/SubmitCard"
import { Button } from "./Button"

export const CreateProyectoButton = () => {
  const [isIndividualAddOpen, setIsIndividualAddOpen] = useState(false)
  const [isFileAddOpen, setIsFileAddOpen] = useState(false)
  const [areOptionsOpened, setAreOptionsOpened] = useState(false)

  return (
    <>
      {areOptionsOpened ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="h-full w-full fixed top-0 left-0 "
          onClick={() => setAreOptionsOpened(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setAreOptionsOpened(false)
          }}
        />
      ) : null}
      <Button
        className="mb-2 relative"
        onClick={() => setAreOptionsOpened(!areOptionsOpened)}
      >
        Añadir Proyecto
        <PlusIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
        {areOptionsOpened ? (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="flex flex-col rounded-md items-start absolute bg-white top-[-65px] left-[0px] w-full"
            onKeyDown={(e) => {
              if (e.key === "Escape") setAreOptionsOpened(false)
            }}
          >
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
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) setAreOptionsOpened(false)
              }}
            >
              Por archivo
              <ArrowUpTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
            </button>
          </div>
        ) : null}
      </Button>

      {isIndividualAddOpen ? (
        <ProyectoCreateCard onClose={() => setIsIndividualAddOpen(false)} />
      ) : null}
      {isFileAddOpen ? (
        <ProyectoSubmitCard onClose={() => setIsFileAddOpen(false)} />
      ) : null}
    </>
  )
}
