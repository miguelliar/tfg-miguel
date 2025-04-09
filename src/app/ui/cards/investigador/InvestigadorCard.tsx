"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { KeyboardEvent } from "react"
import { useEffect, useState } from "react"

import type { ProyectoMinimumDataType } from "@/app/utils"
import {
  deleteInvestigador,
  fetchAllProyectosByInvestigadores,
  fetchNombresDeAutor,
  type InvestigadorType,
} from "@/db"

import { DeleteButton } from "../../button"
import { EditButton } from "../../button/EditButton"
import { EditInvestigadorForm } from "../../form/edit/EditInvestigadorForm"
import { CardModal } from "../CardModal"
import { HorizontalCard } from "../HorizontalCard"

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const closeModal = () => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("email")
    replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    fetchNombresDeAutor(investigador.email).then((nombresAutor) =>
      setNombresAutor(nombresAutor || [])
    )
    fetchAllProyectosByInvestigadores([investigador.email]).then((proyecto) =>
      setProyectosParticipa(proyecto ?? [])
    )
  }, [investigador])

  const editButtonOnKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab" && event.shiftKey) {
      closeModal()
    }
  }

  return (
    <CardModal
      option={
        <>
          <EditButton
            isEditMode={isEditMode}
            setEditMode={setEditMode}
            onKeyDown={editButtonOnKeyDown}
          />
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
      <h2 className="text-special-color">Email: {investigador.email}</h2>
      {isEditMode ? (
        <EditInvestigadorForm
          investigador={investigador}
          finishEditMode={() => setEditMode(false)}
        />
      ) : (
        <div className="flex flex-col gap-2 my-3">
          <div className="w-full">
            <h3 className="align-middle">
              <b>Nombre:</b>
            </h3>
            <p>{investigador.nombre}</p>
          </div>
          <div className="w-full">
            <h3 className="align-middle">
              <b>Apellidos:</b>
            </h3>
            <p>{investigador.apellidos}</p>
          </div>
          <div>
            <b>Universidad:</b>
            <p>{investigador.universidad}</p>
          </div>
          <div>
            <b>Departamento:</b>
            <p>{investigador.departamento}</p>
          </div>
          <div>
            <b>Area:</b>
            <p>{investigador.area}</p>
          </div>
          <div>
            <b>Figura:</b>
            <p>{investigador.figura}</p>
          </div>
          {proyectosParticipa.length > 0 && (
            <>
              <b className="mt-5">Nombres de autor</b>
              <ul>
                {nombresAutor.map((nombre) => (
                  <li key={nombre}>{nombre}</li>
                ))}
              </ul>
              <b className="mt-5">Participante en</b>
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
                        className="text-background-color bg-font-color flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-font-color outline-2"
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
