"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  fetchAllProyectosByInvestigadores,
  fetchDistinctProyectosByInvestigadores,
  fetchJoinProyectosByInvestigadores,
} from "@/db"
import type { ProyectoMinimumDataType } from "@/proyectos"

import { Button } from "../button/Button"

export const FETCH_PROYECTO_OPTION: {
  [name: string]: {
    text: string
    fetcher: (
      investigadoresEmail: string[]
    ) => Promise<ProyectoMinimumDataType[] | undefined>
  }
} = {
  ALL: {
    text: " participe al menos un investigador",
    fetcher: fetchAllProyectosByInvestigadores,
  },
  JOIN: {
    text: " participen todos los investigadores",
    fetcher: fetchJoinProyectosByInvestigadores,
  },
  DISTINCT: {
    text: " no participen en conjunto",
    fetcher: fetchDistinctProyectosByInvestigadores,
  },
}

export const ProyectoByInvestigadorSearcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const onSubmit = (proyectoSearchType: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    if (params.has("proyectoSearchType"))
      params.set("proyectoSearchType", proyectoSearchType)
    else params.append("proyectoSearchType", proyectoSearchType)
    params.sort()
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      className="flex flex-col my-4 basis-1/2 flex-grow"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(
          (
            e.currentTarget.elements.namedItem(
              "proyectSelection"
            ) as HTMLInputElement
          ).value
        )
      }}
    >
      <h3 className="text-xl">Filtrado de proyectos</h3>
      <label className="mb-4 flex flex-col" htmlFor="proyectSelection">
        Tipo de selección
        <select
          className="w-fit"
          id="proyectSelection"
          aria-label="Mostrar proyectos según la condición"
        >
          {Object.keys(FETCH_PROYECTO_OPTION).map((optionValues) => (
            <option value={optionValues} key={optionValues}>
              {FETCH_PROYECTO_OPTION[optionValues].text}
            </option>
          ))}
        </select>
      </label>
      <Button className="w-fit" type="submit">
        Buscar
        <MagnifyingGlassIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
      </Button>
    </form>
  )
}
