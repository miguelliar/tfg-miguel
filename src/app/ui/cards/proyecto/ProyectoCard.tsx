"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import {
  PencilIcon as ActivePencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { useState } from "react"

import type { ProyectoType } from "@/app/utils"
import { getStringDate } from "@/app/utils/formatDate"

import { EditProyectoForm } from "../../form/edit"

export const ProyectoCard = ({
  proyecto,
  onClose,
}: {
  proyecto: ProyectoType
  onClose: () => void
}) => {
  const [isEditMode, setEditMode] = useState(false)

  const wrapperOnKeyDown = (event: any) => {
    if (event.key === "Escape") {
      onClose()
    }
  }
  const closeBtnOnKeyDown = (event: any) => {
    if (event.key === "Tab") {
      onClose()
    }
  }

  return (
    <div
      className="h-full w-full fixed top-0 left-0 bg-slate-600/50 z-10"
      onClick={onClose}
      onKeyDown={wrapperOnKeyDown}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <section
        className="flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-color rounded-lg px-3 py-6 w-fit"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="fixed top-2 right-2">
          {isEditMode ? (
            <button
              className="w-6"
              type="button"
              onClick={() => setEditMode(false)}
            >
              <ActivePencilIcon title="Finalizar de editar proyecto" />
            </button>
          ) : (
            <button
              className="w-6"
              type="button"
              onClick={() => setEditMode(true)}
            >
              <InactivePencilIcon title="Editar proyecto" />
            </button>
          )}
          <button
            className="w-6"
            type="button"
            onClick={onClose}
            onKeyDown={closeBtnOnKeyDown}
          >
            <XMarkIcon title="Cerrar tarjeta de proyecto" />
          </button>
        </div>
        <div className="flex flex-col justify-around mx-8 items-center">
          <h2 className="text-special-color">Codigo: {proyecto.codigo}</h2>
          {isEditMode ? (
            <EditProyectoForm
              proyecto={proyecto}
              finishEditMode={() => setEditMode(false)}
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
                  <p>{getStringDate(proyecto.inicio, "Sin inicio")}</p>
                </div>
                <div>
                  <b>Fin:</b>
                  <p>{getStringDate(proyecto.fin, "Sin fin")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
