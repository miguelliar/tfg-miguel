"use client"

import { ArrowTopRightOnSquareIcon, UsersIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

import { getStringDate } from "@/app/utils"
import { useQueryParam } from "@/app/utils/hooks/useQueryParam"
import {
  deleteProyecto,
  fetchParticipaByCodigoProyecto,
  updateProyectoItem,
} from "@/db"
import type { ParticipaType } from "@/participa"
import { CardModal, DeleteButton, EditButton, HorizontalCard } from "@/ui"

import { EditProyectoForm } from "../form"
import type { ProyectoType } from "../types"

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
      <h2 className="text-accent-primary">Codigo: {proyecto.codigo}</h2>
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
          <div>
            <h3>
              <b className="text-wrap">Investigador Principal: </b>
            </h3>
            <p className="text-nowrap">{proyecto.ip}</p>
          </div>

          {proyecto.coip && (
            <div className="mt-1">
              <h3>
                <b>Co Investigador Principal: </b>
              </h3>
              <p>{proyecto.coip}</p>
            </div>
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
              <h3>
                <b>Inicio:</b>
              </h3>
              <p suppressHydrationWarning>
                {getStringDate(proyecto.inicio, "Sin inicio")}
              </p>
            </div>
            <div>
              <h3>
                <b>Fin:</b>
              </h3>
              <p suppressHydrationWarning>
                {getStringDate(proyecto.fin, "Sin fin")}
              </p>
            </div>
          </div>
          {participaciones.length > 0 && (
            <div>
              <div className="flex flex-row mt-5 gap-2">
                <UsersIcon className="w-4" />
                <h3>
                  <b>Participantes</b>
                </h3>
              </div>
              <div className="flex flex-col overflow-auto items-center gap-2">
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
                        className="text-secondary bg-primary flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-primary outline-2 hover:text-secondary hover:bg-primary-strong"
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
            </div>
          )}
        </div>
      )}
    </CardModal>
  )
}
