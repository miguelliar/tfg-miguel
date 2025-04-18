"use client"

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

import type { ParticipaType, ProyectoType } from "@/app/utils"
import { getStringDate } from "@/app/utils"
import { useQueryParam } from "@/app/utils/hooks/useQueryParam"
import {
  deleteProyecto,
  fetchParticipaByCodigoProyecto,
  updateProyectoItem,
} from "@/db"

import { DeleteButton, EditButton } from "../../button"
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
  const { removeQueryParam } = useQueryParam()

  useEffect(() => {
    fetchParticipaByCodigoProyecto(proyecto.codigo).then((participa) =>
      setParticipaciones(participa ?? [])
    )
  }, [proyecto])

  return (
    <CardModal
      option={
        !unSync && (
          <>
            <EditButton isEditMode={isEditMode} setEditMode={setEditMode} />
            <DeleteButton
              className=""
              deleteEvent={() => deleteProyecto(proyecto.codigo)}
              title="Borrar proyecto"
              warningMessage={`El proyecto ${proyecto.codigo} así como las participaciones del mismo serán eliminados`}
              submitMessages={{
                onSuccess: "Se ha borrado el proyecto y sus participantes",
                onFailure:
                  "Ha habido un problema al borrar el proyecto y sus participantes",
              }}
            />
          </>
        )
      }
      onClose={() => removeQueryParam("codigo")}
    >
      <h2 className="text-special-color">Codigo: {proyecto.codigo}</h2>
      {isEditMode && !unSync ? (
        <EditProyectoForm
          proyecto={proyecto}
          finishEditMode={() => {
            setEditMode(false)
          }}
          participaciones={participaciones}
          onUpdate={(proyecto?: ProyectoType) => {
            if (proyecto) {
              updateProyectoItem(proyecto)
            }
          }}
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
                {participaciones.map((participa) => {
                  const emailDirection = new URLSearchParams([
                    ["email", participa.email],
                  ])

                  return (
                    <HorizontalCard
                      key={participa.email}
                      id={participa.email}
                      content={participa.nombreAutor}
                    >
                      <a
                        className="text-background-color bg-font-color flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-font-color outline-2"
                        href={`investigadores?${emailDirection.toString()}`}
                        target="_blank"
                      >
                        Ver
                        <ArrowTopRightOnSquareIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
                      </a>
                    </HorizontalCard>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </CardModal>
  )
}
