"use client"

import type { KeyboardEvent } from "react"
import { useContext, useRef } from "react"

import type { ProyectoType } from "@/app/utils"
import { CloseRefContext, parseDateToString } from "@/app/utils"

import { useEditProyectoForm } from "./useEditProyectoForm"

export type EditProyectoFormProps = {
  proyecto: ProyectoType
  finishEditMode: () => void
}

export const EditProyectoForm = ({
  proyecto,
  finishEditMode,
}: EditProyectoFormProps) => {
  const [editedProyecto, errors, handleChange, onSubmit] = useEditProyectoForm(
    proyecto,
    finishEditMode
  )
  // TODO: tech debt, get all logic inside hook
  const closeBtnRef = useContext(CloseRefContext)
  const startingInput = useRef<HTMLInputElement>(null)
  const cancelButton = useRef<HTMLButtonElement>(null)

  const cancelarButtonOnKeyPress = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault()
      startingInput.current?.focus()
    }
    if (e.key === "Enter") {
      e.preventDefault()
      closeBtnRef?.current?.focus()
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
      {errors.ip && <span style={{ color: "red" }}>{errors.ip}</span>}
      <label className="flex flex-col w-full" htmlFor="ip">
        <b>Investigador Principal: </b>
        <input
          id="ip"
          name="ip"
          type="text"
          required
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          ref={startingInput}
          placeholder="Investigador Principal"
          defaultValue={editedProyecto.ip}
          onChange={handleChange}
          onKeyDown={startingInputOnKeyPress}
        />
      </label>
      {errors.coip && <span style={{ color: "red" }}>{errors.coip}</span>}
      <label className="flex flex-col w-full" htmlFor="coip">
        <b>Co Investigador Principal: </b>
        <input
          id="coip"
          name="coip"
          type="text"
          placeholder="Co Investigador Principal"
          defaultValue={editedProyecto.coip}
          onChange={handleChange}
        />
      </label>
      {errors.titulo && <span style={{ color: "red" }}>{errors.titulo}</span>}
      <label className="flex flex-col w-full" htmlFor="titulo">
        <h3 className="align-middle">
          <b>Descripcion: </b>
        </h3>
        <textarea
          className=""
          id="titulo"
          name="titulo"
          placeholder="Titulo"
          defaultValue={editedProyecto.titulo}
          onChange={handleChange}
        />
      </label>
      {errors.financiado && (
        <span style={{ color: "red" }}>{errors.financiado}</span>
      )}
      <label className="flex flex-col w-full" htmlFor="financiado">
        <b>Financiado:</b>
        <textarea
          id="financiado"
          name="financiado"
          placeholder="Financiado"
          defaultValue={editedProyecto.financiado}
          onChange={handleChange}
        />
      </label>
      {errors.fechaInicio && (
        <span style={{ color: "red" }}>{errors.fechaInicio}</span>
      )}
      {errors.fechaFin && (
        <span style={{ color: "red" }}>{errors.fechaFin}</span>
      )}
      <div className="flex flex-row justify-around">
        <label htmlFor="inicio">
          <b>Inicio:</b>
          <input
            id="inicio"
            name="inicio"
            type="date"
            placeholder="Inicio"
            required
            defaultValue={parseDateToString(editedProyecto.inicio)}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="fin">
          <b>Fin:</b>
          <input
            id="fin"
            name="fin"
            type="date"
            placeholder="Fin"
            defaultValue={
              editedProyecto.fin && parseDateToString(editedProyecto.fin)
            }
            onChange={handleChange}
          />
        </label>
      </div>
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
