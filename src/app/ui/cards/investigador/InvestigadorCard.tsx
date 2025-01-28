"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import {
  PencilIcon as ActivePencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid"
import { useState } from "react"

import type { InvestigadorType } from "@/db"

import { EditInvestigadorForm } from "../../form/edit/EditInvestigadorForm"

export const InvestigadorCard = ({
  investigador,
  onClose,
}: {
  investigador: InvestigadorType
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
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
