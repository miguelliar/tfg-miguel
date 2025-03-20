"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { KeyboardEvent } from "react"
import { useEffect, useState } from "react"

import type { ParticipaType, ProyectoType } from "@/app/utils"
import { getStringDate } from "@/app/utils"
import { fetchParticipaByCodigoProyecto } from "@/db"

import { EditButton } from "../../button/EditButton"
import { EditProyectoForm } from "../../form/edit"
import { CardModal } from "../CardModal"
import { HorizontalCard } from "../HorizontalCard"

export const ProyectoCard = ({
  proyecto,
  unSync,
}: {
  proyecto: ProyectoType
  unSync?: boolean
}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [participaciones, setParticipaciones] = useState<ParticipaType[]>([])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const closeModal = () => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("codigo")
    replace(`${pathname}?${params.toString()}`)
  }

  const editButtonOnKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab" && event.shiftKey) {
      closeModal()
    }
  }

  useEffect(() => {
    fetchParticipaByCodigoProyecto(proyecto.codigo).then((participa) =>
      setParticipaciones(participa ?? [])
    )
  }, [proyecto])

  return (
    <CardModal
      option={
        !unSync && (
          <EditButton
            isEditMode={isEditMode}
            setEditMode={setEditMode}
            onKeyDown={editButtonOnKeyDown}
          />
        )
      }
      onClose={closeModal}
    >
      <h2 className="text-special-color">Codigo: {proyecto.codigo}</h2>
      {isEditMode && !unSync ? (
        <EditProyectoForm
          proyecto={proyecto}
          finishEditMode={() => {
            setEditMode(false)
          }}
          participaciones={participaciones}
        />
      ) : (
        <div className="flex flex-col gap-2 my-3">
          <p>
            <b className="text-wrap">Investigador Principal: </b>
            <span className="text-nowrap">{proyecto.ip}</span>
          </p>
          {proyecto.coip && (
            <p className="mt-1">
              <b>Co Investigador Principal: </b>
              {proyecto.coip}
            </p>
          )}
          <div className="w-full">
            <h3 className="align-middle">
              <b>Descripcion</b>
            </h3>
            <p>{proyecto.titulo}</p>
          </div>
          <div>
            <b>Financiado:</b>
            <p>{proyecto.financiado}</p>
          </div>
          <div className="flex flex-row justify-around">
            <div>
              <b>Inicio:</b>
              <p suppressHydrationWarning>
                {getStringDate(proyecto.inicio, "Sin inicio")}
              </p>
            </div>
            <div>
              <b>Fin:</b>
              <p suppressHydrationWarning>
                {getStringDate(proyecto.fin, "Sin fin")}
              </p>
            </div>
          </div>
          {participaciones.length > 0 && (
            <>
              <b className="mt-5">Participantes</b>
              <div className="flex flex-col overflow-auto gap-2">
                {participaciones.map((participa) => (
                  <HorizontalCard
                    key={participa.email}
                    id={participa.email}
                    content={participa.nombreAutor}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </CardModal>
  )
}
