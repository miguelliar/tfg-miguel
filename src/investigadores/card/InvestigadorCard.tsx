"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */

import {
  ArrowTopRightOnSquareIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"

import {
  deleteInvestigador,
  fetchAllProyectosByInvestigadores,
  fetchNombresDeAutor,
} from "@/db"
import type { ProyectoMinimumDataType } from "@/proyectos"
import { CardModal, DeleteButton, EditButton, HorizontalCard } from "@/ui"
import { useQueryParam } from "@/utils/hooks/useQueryParam"

import { EditInvestigadorForm } from "../form"
import type { InvestigadorType } from "../types"

export const InvestigadorCard = ({
  investigador,
}: {
  investigador: InvestigadorType
}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [proyectosParticipa, setProyectosParticipa] = useState<
    ProyectoMinimumDataType[]
  >([])
  const [nombresAutor, setNombresAutor] = useState<string[]>([])
  const { removeQueryParam } = useQueryParam()

  const closeModal = () => {
    removeQueryParam("email")
  }

  useEffect(() => {
    fetchNombresDeAutor(investigador.email).then((nombresAutor) =>
      setNombresAutor(nombresAutor || [])
    )
    fetchAllProyectosByInvestigadores([investigador.email]).then((proyecto) =>
      setProyectosParticipa(proyecto ?? [])
    )
  }, [investigador])

  return (
    <CardModal
      option={
        <>
          <EditButton isEditMode={isEditMode} setEditMode={setEditMode} />
          <DeleteButton
            deleteEvent={() => deleteInvestigador(investigador.email)}
            title="Borrar investigador"
            warningMessage={`El investigador ${investigador.email} así como las participaciones del mismo serán eliminados`}
            submitMessages={{
              onSuccess: "Se ha borrado el investigador",
              onFailure: "Ha habido un problema al borrar los datos",
            }}
          />
        </>
      }
      onClose={closeModal}
    >
      <h2 className="text-accent-primary">Email: {investigador.email}</h2>
      {isEditMode ? (
        <EditInvestigadorForm
          investigador={investigador}
          finishEditMode={() => setEditMode(false)}
        />
      ) : (
        <div className="flex flex-col gap-2 my-3">
          <div className="w-full">
            <h3 className="align-middle">
              <strong>Nombre:</strong>
            </h3>
            <p>{investigador.nombre}</p>
          </div>
          <div className="w-full">
            <h3 className="align-middle">
              <strong>Apellidos:</strong>
            </h3>
            <p>{investigador.apellidos}</p>
          </div>
          <div>
            <strong>Universidad:</strong>
            <p>{investigador.universidad}</p>
          </div>
          <div>
            <h3>
              <strong>Departamento:</strong>
            </h3>
            <p>{investigador.departamento}</p>
          </div>
          <div>
            <h3>
              <strong>Area:</strong>
            </h3>
            <p>{investigador.area}</p>
          </div>
          <div>
            <h3>
              <strong>Figura:</strong>
            </h3>
            <p>{investigador.figura}</p>
          </div>
          {proyectosParticipa.length > 0 && (
            <>
              <h3 className="mt-5">
                <strong>Nombres de autor</strong>
              </h3>
              <ul>
                {nombresAutor.map((nombre) => (
                  <li key={nombre}>{nombre}</li>
                ))}
              </ul>
              <div className="flex flex-row mt-5">
                <DocumentMagnifyingGlassIcon className="w-4" />
                <h3>
                  <strong>Participante en</strong>
                </h3>
              </div>
              <div className="flex flex-col overflow-auto gap-2">
                {proyectosParticipa.map((proyecto) => {
                  const proyectoCode = new URLSearchParams([
                    ["codigo", proyecto.codigo],
                  ])
                  return (
                    <HorizontalCard
                      key={proyecto.codigo}
                      id={proyecto.codigo}
                      content={proyecto.titulo}
                    >
                      <a
                        className="text-secondary bg-primary flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-primary outline-2"
                        href={`proyectos?${proyectoCode.toString()}`}
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
