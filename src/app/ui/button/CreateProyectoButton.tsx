"use client"

import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const CreateProyectoButton = () => {
  const [areOptionsOpened, setAreOptionsOpened] = useState(false)
  const { push } = useRouter()

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
      <div
        className="flex flex-row text-nowrap mb-2 relative max-h-fit rounded-md border p-2 border-primary hover:border-primary-strong focus:border-primary-strong outline-2 text-primary hover:text-primary-strong focus:text-primary-strong bg-secondary"
        tabIndex={0}
        role="button"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setAreOptionsOpened(!areOptionsOpened)
          }
        }}
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
            <a
              className="pl-2 p-1 text-primary hover:text-primary-strong focus:text-primary-strong"
              href="proyectos/crear/nuevo"
              onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey) {
                  setAreOptionsOpened(!areOptionsOpened)
                }
                if (e.key === "Enter" || e.key === "Space")
                  push("proyectos/crear/nuevo")
              }}
            >
              Individualmente
            </a>
            <a
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  setAreOptionsOpened(!areOptionsOpened)
                }
                if (e.key === "Enter" || e.key === "Space")
                  push("proyectos/crear/subida")
              }}
              className="flex flex-row pl-2 p-1 text-primary hover:text-primary-strong focus:text-primary-strong"
              href="proyectos/crear/subida"
            >
              Por archivo
              <ArrowUpTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
            </a>
          </div>
        ) : null}
      </div>
    </>
  )
}
