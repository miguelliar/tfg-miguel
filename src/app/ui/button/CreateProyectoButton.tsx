"use client"

import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

export const CreateProyectoButton = () => {
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
      <div
        className="flex flex-row text-nowrap mb-2 relative max-h-fit rounded-md border p-2 border-font-color hover:border-font-color-accent focus:border-font-color-accent outline-2 text-font-color hover:text-font-color-accent focus:text-font-color-accent bg-background-color"
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
              className="pl-2 p-1 text-font-color hover:text-font-color-accent focus:text-font-color-accent"
              href="proyectos/crear/nuevo"
              onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey) {
                  setAreOptionsOpened(!areOptionsOpened)
                }
              }}
            >
              Individualmente
            </a>
            <a
              onKeyDown={(e) => {
                if (e.key === "Tab" && !e.shiftKey) {
                  setAreOptionsOpened(!areOptionsOpened)
                }
              }}
              className="flex flex-row pl-2 p-1 text-font-color hover:text-font-color-accent focus:text-font-color-accent"
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
