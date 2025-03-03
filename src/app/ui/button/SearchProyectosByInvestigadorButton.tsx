"use client"

import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/solid"
import cx from "classnames"
import { useContext } from "react"

import { SearchProyectoByInvestigadorContext } from "@/app/utils"

import { Button } from "./Button"

export const SearchProyectosByInvestigadorButton = () => {
  const {
    isSearchProyectosByInvestigadorActive: isActive,
    switchSearchProyectosByInvestigadorActive: switchActive,
  } = useContext(SearchProyectoByInvestigadorContext)
  return (
    <Button
      onClick={switchActive}
      className={cx({
        "text-special-color": isActive,
        "border-special-color": isActive,
      })}
    >
      Iniciar Búsqueda
      <DocumentMagnifyingGlassIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
    </Button>
  )
}
