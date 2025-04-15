"use client"

import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import cx from "classnames"
import { isEqual } from "lodash"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  fetchAllProyectosByInvestigadores,
  fetchDistinctProyectosByInvestigadores,
  fetchJoinProyectosByInvestigadores,
  fetchProyectoByCode,
} from "@/db"

import type { ProyectoMinimumDataType, ProyectoType } from "../utils"
import { downloadProyectosCSV } from "../utils"
import { Button } from "./button/Button"
import { ProyectoCard, ProyectoMiniCard } from "./cards"

const FETCH_PROYECTO_OPTION: {
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

const InvestigadoresList = ({
  selectedInvestigadores,
}: {
  selectedInvestigadores: string[]
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const removeInvestigador = (email: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("selectedEmail", email)
    replace(`${pathname}?${params.toString()}`)
  }

  const removeAll = () => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("selectedEmail")
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col mt-4 basis-1/2 flex-grow">
      <h3 className="text-xl">Investigadores seleccionados</h3>
      <section>
        <ul
          className={cx(
            "flex flex-col gap-2 px-3 py-2 my-2 outline-2 border-font-color rounded-md list-disc  min-w-72 max-w-96",
            { border: selectedInvestigadores.length }
          )}
        >
          {selectedInvestigadores.map((investigador) => (
            <li key={investigador} className="flex flex-row gap-4">
              <Button
                variant="fill"
                className="py-0"
                onClick={() => removeInvestigador(investigador)}
              >
                Quitar
              </Button>
              <b className="text-special-color overflow-hidden text-ellipsis">
                {investigador}
              </b>
            </li>
          ))}
        </ul>
        {selectedInvestigadores.length ? (
          <Button variant="fill" onClick={removeAll}>
            Quitar todos
          </Button>
        ) : null}
      </section>
    </div>
  )
}

const ProyectoByInvestigadorSearcher = () => {
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

export const MostrarProyectos = () => {
  const [proyectoSearched, setProyectoSearched] = useState<ProyectoType | null>(
    null
  )
  const [searchedProyectos, setSearchedProyectos] = useState<
    ProyectoMinimumDataType[]
  >([])

  const params = useSearchParams()
  const searchParams = useMemo(
    () => new URLSearchParams(params ?? ""),
    [params]
  )

  const searchType = searchParams.get("proyectoSearchType")
  const selectedProyecto = searchParams.get("codigo")
  const selectedInvestigadores = searchParams.getAll("selectedEmail")

  const previousSelectedInvesigadores = useRef<string[]>([])
  const previousSearchType = useRef<string>("")

  useEffect(() => {
    if (
      searchType &&
      (!isEqual(previousSearchType.current, searchType) ||
        !isEqual(previousSelectedInvesigadores.current, selectedInvestigadores))
    ) {
      previousSearchType.current = searchType
      previousSelectedInvesigadores.current = selectedInvestigadores
      FETCH_PROYECTO_OPTION[searchType]
        .fetcher(selectedInvestigadores)
        .then((proyectos) => {
          if (proyectos) {
            setSearchedProyectos(proyectos)
          }
        })
    }
  }, [setSearchedProyectos, searchType, selectedInvestigadores])

  useEffect(() => {
    if (selectedProyecto) {
      fetchProyectoByCode(selectedProyecto).then((proyecto) =>
        setProyectoSearched(proyecto ?? null)
      )
    } else {
      setProyectoSearched(null)
    }
  }, [selectedProyecto])

  return (
    <section className="my-8">
      <h2 className="text-2xl">
        <b>Busqueda de proyectos</b>
      </h2>
      {proyectoSearched && <ProyectoCard proyecto={proyectoSearched} />}
      <div className="flex flex-col md:flex-row gap-16 justify-start">
        <InvestigadoresList selectedInvestigadores={selectedInvestigadores} />
        <ProyectoByInvestigadorSearcher />
      </div>
      {searchedProyectos && searchedProyectos.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
            <h2 className="text-2xl">Proyectos Encontrados</h2>
            <Button
              className="w-fit"
              variant="border"
              onClick={() =>
                downloadProyectosCSV(
                  searchedProyectos.map((proyecto) => proyecto.codigo)
                )
              }
            >
              Descargar proyectos en CSV
              <ArrowDownTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
            </Button>
          </div>
          {searchedProyectos && (
            <div className="grid grid-cols-adaptable gap-4">
              {searchedProyectos.map((proyecto) => (
                <ProyectoMiniCard
                  key={`ProyectoCard-${proyecto.codigo}`}
                  proyecto={proyecto}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  )
}
