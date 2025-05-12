"use client"

import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/solid"
import cx from "classnames"
import { useContext } from "react"

import { Button } from "@/ui"
import { SearchProyectoByInvestigadorContext } from "@/utils"

export const SearchProyectosByInvestigadorButton = () => {
  const {
    isSearchProyectosByInvestigadorActive: isActive,
    switchSearchProyectosByInvestigadorActive: switchActive,
  } = useContext(SearchProyectoByInvestigadorContext)
  return (
    <Button
      onClick={switchActive}
      className={cx("max-w-fit p-2 border outline-2", {
        "text-accent-primary border-accent-primary hover:text-accent-primary-strong focus:text-accent-primary-strong hover:border-accent-primary-strong focus:border-accent-primary-strong":
          isActive,
        "text-primary border-primary hover:text-primary-strong focus:text-primary-strong hover:border-primary-strong focus:border-primary-strong":
          !isActive,
      })}
      ariaLabel={`${isActive ? "Iniciar" : "Finalizar"} búsqueda de proyectos por investigador`}
      variant="custom"
    >
      {isActive ? "Finalizar Búsqueda" : "Iniciar Búsqueda"}
      <DocumentMagnifyingGlassIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
    </Button>
  )
}
