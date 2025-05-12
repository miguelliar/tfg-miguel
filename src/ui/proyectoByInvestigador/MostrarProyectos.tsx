"use client"

import {
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import { isEqual } from "lodash"
import { useEffect, useRef, useState } from "react"

import { useQueryParam } from "@/app/utils/hooks/useQueryParam"
import { fetchProyectoByCode } from "@/db"
import type { ProyectoMinimumDataType, ProyectoType } from "@/proyectos"
import {
  downloadProyectosCSV,
  ProyectoCard,
  ProyectoMiniCard,
} from "@/proyectos"

import { Button } from "../button"
import { InvestigadoresList } from "./InvestigadoresList"
import {
  FETCH_PROYECTO_OPTION,
  ProyectoByInvestigadorSearcher,
} from "./ProyectoByInvestigadorSearcher"

export const MostrarProyectos = () => {
  const [proyectoSearched, setProyectoSearched] = useState<ProyectoType | null>(
    null
  )
  const [searchedProyectos, setSearchedProyectos] = useState<
    ProyectoMinimumDataType[]
  >([])

  const { getQueryParam, getAllQueryParams } = useQueryParam()

  const searchType = getQueryParam("proyectoSearchType")
  const selectedProyecto = getQueryParam("codigo")
  const selectedInvestigadores = getAllQueryParams("selectedEmail")

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
      <div className="flex flex-row gap-2">
        <DocumentMagnifyingGlassIcon className="w-6" />
        <h2 className="text-2xl">
          <b>Busqueda de proyectos</b>
        </h2>
      </div>
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
