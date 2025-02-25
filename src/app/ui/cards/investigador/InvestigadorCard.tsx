"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useState } from "react"

import type { InvestigadorType } from "@/db"

import { EditButton } from "../../button/EditButton"
import { EditInvestigadorForm } from "../../form/edit/EditInvestigadorForm"
import { CardModal } from "../CardModal"

export const InvestigadorCard = ({
  investigador,
  onClose,
}: {
  investigador: InvestigadorType
  onClose: () => void
}) => {
  const [isEditMode, setEditMode] = useState(false)

  return (
    <CardModal
      option={<EditButton isEditMode={isEditMode} setEditMode={setEditMode} />}
      onClose={onClose}
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
        </div>
      )}
    </CardModal>
  )
}
