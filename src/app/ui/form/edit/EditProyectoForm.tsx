"use client"

import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import type { KeyboardEvent } from "react"
import { useContext, useRef, useState } from "react"

import type { ParticipaType, ProyectoType } from "@/app/utils"
import { CloseRefContext, parseDateToString } from "@/app/utils"

import { Button } from "../../button/Button"
import { HorizontalCard } from "../../cards/HorizontalCard"
import { AddParticipanteCard } from "../../menu/AddParticipante"
import { useEditProyectoForm } from "./useEditProyectoForm"

export type EditProyectoFormProps = {
  proyecto: ProyectoType
  finishEditMode: () => void
  participaciones: ParticipaType[]
}

export const EditProyectoForm = ({
  proyecto,
  finishEditMode,
  participaciones,
}: EditProyectoFormProps) => {
  const [isAddingParticipante, setIsAddingParticipante] = useState(false)
  const {
    editedProyecto,
    editedParticipaciones,
    errors,
    handleChange,
    onSubmit,
    addParticipa,
    removeParticipa,
  } = useEditProyectoForm(proyecto, finishEditMode, participaciones)
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

  const closeMenuOnClick = () => {
    if (isAddingParticipante) setIsAddingParticipante(false)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <form
      className="flex flex-col gap-2 my- w-full"
      onClick={closeMenuOnClick}
      onSubmit={onSubmit}
    >
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
      <div className="flex flex-col justify-start items-center">
        <b className="mt-5">Participantes</b>
        {editedParticipaciones.length > 0 && (
          <div className="flex flex-col gap-2 overflow-auto mt-2">
            {editedParticipaciones.map((participa) => (
              <div
                key={`row-${participa.email}`}
                className="flex flex-row gap-2 w-full"
              >
                <HorizontalCard
                  id={participa.email}
                  content={participa.nombreAutor}
                  onClick={() => {}}
                />
                <Button
                  variant="minimal"
                  className="rounded-3xl p-0"
                  onClick={() => removeParticipa(participa)}
                >
                  <MinusCircleIcon className="h-[34px] w-[34px] text-red-700 bg-background-color rounded-full" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          {isAddingParticipante && (
            <AddParticipanteCard
              codigo={proyecto.codigo}
              onAdd={addParticipa}
              onClose={() => setIsAddingParticipante(false)}
            />
          )}
          <Button
            onClick={() => {
              setIsAddingParticipante(true)
            }}
            variant="minimal"
            className="rounded-3xl p-0"
          >
            <PlusCircleIcon className="h-[40px] w-[40px] text-font-color bg-background-color rounded-full" />
          </Button>
        </div>
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
