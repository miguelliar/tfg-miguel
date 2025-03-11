"use client"

import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import cx from "classnames"
import { useContext, useMemo, useState } from "react"

import type { InvestigadorType } from "@/db"
import {
  fetchAllProyectosByInvestigadores,
  fetchDistinctProyectosByInvestigadores,
  fetchJoinProyectosByInvestigadores,
} from "@/db"

import {
  downloadProyectosCSV,
  InvestigadorContext,
  type ProyectoType,
} from "../utils"
import { Button } from "./button/Button"
import { ProyectoMiniCard } from "./cards"

const FETCH_PROYECTO_OPTION: {
  [name: string]: {
    text: string
    fetcher: (
      investigadoresEmail: string[]
    ) => Promise<ProyectoType[] | undefined>
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
  selectedInvestigadores: InvestigadorType[]
}) => {
  const { select, clearAllSelected } = useContext(InvestigadorContext)

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
            <li key={investigador.email} className="flex flex-row gap-4">
              <Button
                variant="fill"
                className="py-0"
                onClick={() => select?.({ investigadorSelected: investigador })}
              >
                Quitar
              </Button>
              <b className="text-special-color overflow-hidden text-ellipsis">
                {investigador.email}
              </b>
            </li>
          ))}
        </ul>
        {selectedInvestigadores.length ? (
          <Button variant="fill" onClick={clearAllSelected}>
            Quitar todos
          </Button>
        ) : null}
      </section>
    </div>
  )
}

const ProyectoByInvestigadorSearcher = ({
  fetchSearchedProyectos,
}: {
  fetchSearchedProyectos: (
    fetchByInvestigadorFunction: (
      investigadoresEmail: string[]
    ) => Promise<ProyectoType[] | undefined>
  ) => Promise<void>
}) => {
  return (
    <form
      className="flex flex-col my-4 basis-1/2 flex-grow"
      onSubmit={(e) => {
        e.preventDefault()
        fetchSearchedProyectos(
          FETCH_PROYECTO_OPTION[
            (
              e.currentTarget.elements.namedItem(
                "proyectSelection"
              ) as HTMLInputElement
            ).value
          ].fetcher
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

export const MostrarProyectos = ({
  selectedInvestigadores,
}: {
  selectedInvestigadores: InvestigadorType[]
}) => {
  const [searchedProyectos, setSearchedProyectos] = useState<ProyectoType[]>([])
  const proyectosMinimumData = useMemo(
    () =>
      searchedProyectos.map((proyecto) => ({
        codigo: proyecto.codigo,
        titulo: proyecto.titulo,
      })),
    [searchedProyectos]
  )
  const fetchSearchedProyectos = async (
    fetchByInvestigadorFunction: (
      investigadoresEmail: string[]
    ) => Promise<ProyectoType[] | undefined>
  ) => {
    const proyectos = await fetchByInvestigadorFunction(
      selectedInvestigadores.map((investigador) => investigador.email)
    )
    if (proyectos) {
      setSearchedProyectos(proyectos)
    }
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl">
        <b>Busqueda de proyectos</b>
      </h2>
      <div className="flex flex-col md:flex-row gap-16 justify-start">
        <InvestigadoresList selectedInvestigadores={selectedInvestigadores} />
        <ProyectoByInvestigadorSearcher
          fetchSearchedProyectos={fetchSearchedProyectos}
        />
      </div>
      {searchedProyectos && searchedProyectos.length > 0 && (
        <section className="mt-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
            <h2 className="text-2xl">Proyectos Encontrados</h2>
            <Button
              className="w-fit"
              variant="border"
              onClick={() => downloadProyectosCSV(searchedProyectos)}
            >
              Descargar proyectos en CSV
              <ArrowDownTrayIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
            </Button>
          </div>
          {
            // TODO: Add Modal for Product detail view
            proyectosMinimumData && (
              <div className="grid grid-cols-adaptable gap-4">
                {proyectosMinimumData.map((proyecto) => (
                  <ProyectoMiniCard
                    key={`ProyectoCard-${proyecto.codigo}`}
                    proyecto={proyecto}
                  />
                ))}
              </div>
            )
          }
        </section>
      )}
    </section>
  )
}
