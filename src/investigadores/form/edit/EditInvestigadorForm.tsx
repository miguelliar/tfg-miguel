"use client"

import type { KeyboardEvent } from "react"
import { useRef } from "react"

import type { InvestigadorType } from "@/investigadores/types"

import { useEditInvestigadorForm } from "./useEditInvestigadorForm"

export type EditInvestigadorFormProps = {
  investigador: InvestigadorType
  finishEditMode: () => void
}

export const EditInvestigadorForm = ({
  investigador,
  finishEditMode,
}: EditInvestigadorFormProps) => {
  const [editedInvestigador, errors, handleChange, onSubmit] =
    useEditInvestigadorForm(investigador, finishEditMode)

  const startingInput = useRef<HTMLInputElement>(null)
  const cancelButton = useRef<HTMLButtonElement>(null)

  const cancelarButtonOnKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault()
      startingInput.current?.focus()
    }
    if (e.key === "Enter") {
      e.preventDefault()
      finishEditMode()
    }
  }

  const startingInputOnKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault()
      cancelButton.current?.focus()
    }
  }

  return (
    <form className="flex flex-col gap-2 my-3" onSubmit={(e) => onSubmit(e)}>
      {errors.nombre && <span style={{ color: "red" }}>{errors.nombre}</span>}
      <label htmlFor="nombre">
        <strong>Nombre: </strong>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          ref={startingInput}
          placeholder="Nombre de investigador"
          defaultValue={editedInvestigador.nombre}
          onChange={handleChange}
          onKeyDown={startingInputOnKeyPress}
          className="w-full"
        />
      </label>
      {errors.apellidos && (
        <span style={{ color: "red" }}>{errors.apellidos}</span>
      )}
      <label htmlFor="apellidos">
        <strong>Apellidos: </strong>
        <input
          id="apellidos"
          name="apellidos"
          type="text"
          required
          placeholder="Apellidos del investigador"
          defaultValue={editedInvestigador.apellidos}
          onChange={handleChange}
          className="w-full"
        />
      </label>
      {errors.universidad && (
        <span style={{ color: "red" }}>{errors.universidad}</span>
      )}
      <label className="w-full" htmlFor="universidad">
        <h3 className="align-middle">
          <strong>Universidad: </strong>
        </h3>
        <input
          id="universidad"
          name="universidad"
          type="text"
          placeholder="Universidad del investigador"
          defaultValue={editedInvestigador.universidad}
          onChange={handleChange}
          className="w-full"
        />
      </label>
      {errors.departamento && (
        <span style={{ color: "red" }}>{errors.departamento}</span>
      )}
      <label className="w-full" htmlFor="departamento">
        <h3 className="align-middle">
          <strong>Departamento: </strong>
        </h3>
        <input
          id="departamento"
          name="departamento"
          type="text"
          placeholder="Departamento de la universidad"
          defaultValue={editedInvestigador.departamento}
          onChange={handleChange}
          className="w-full"
        />
      </label>
      {errors.area && <span style={{ color: "red" }}>{errors.area}</span>}
      <label className="w-full" htmlFor="area">
        <h3 className="align-middle">
          <strong>Área: </strong>
        </h3>
        <input
          id="area"
          name="area"
          type="text"
          placeholder="Area del departamento"
          defaultValue={editedInvestigador.area}
          onChange={handleChange}
          className="w-full"
        />
      </label>
      {errors.figura && <span style={{ color: "red" }}>{errors.figura}</span>}
      <label className="w-full" htmlFor="figura">
        <h3 className="align-middle">
          <strong>Figura: </strong>
        </h3>
        <input
          id="figura"
          name="figura"
          type="text"
          placeholder="Figura universitaria"
          defaultValue={editedInvestigador.figura}
          onChange={handleChange}
          className="w-full"
        />
      </label>
      <div className="flex justify-around">
        <button type="submit">Editar</button>
        <button
          type="button"
          onClick={finishEditMode}
          onKeyDown={cancelarButtonOnKeyPress}
          ref={cancelButton}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
