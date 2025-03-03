"use client"

import type { KeyboardEvent } from "react"
import { useState } from "react"

import { type ProyectoType } from "@/app/utils"
import { getStringDate } from "@/app/utils/formatDate"

import { EditButton } from "../../button/EditButton"
import { EditProyectoForm } from "../../form/edit"
import { CardModal } from "../CardModal"

export const ProyectoCard = ({
  proyecto,
  onClose,
}: {
  proyecto: ProyectoType
  onClose: () => void
}) => {
  const [isEditMode, setEditMode] = useState(false)

  const editButtonOnKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab" && event.shiftKey) {
      onClose()
    }
  }

  return (
    <CardModal
      option={
        <EditButton
          isEditMode={isEditMode}
          setEditMode={setEditMode}
          onKeyDown={editButtonOnKeyDown}
        />
      }
      onClose={onClose}
    >
      <h2 className="text-special-color">Codigo: {proyecto.codigo}</h2>
      {isEditMode ? (
        <EditProyectoForm
          proyecto={proyecto}
          finishEditMode={() => {
            setEditMode(false)
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
              <p>{getStringDate(proyecto.inicio, "Sin inicio")}</p>
            </div>
            <div>
              <b>Fin:</b>
              <p>{getStringDate(proyecto.fin, "Sin fin")}</p>
            </div>
          </div>
        </div>
      )}
    </CardModal>
  )
}
