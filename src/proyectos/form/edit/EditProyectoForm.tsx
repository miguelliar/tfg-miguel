"use client"

import {
  MinusCircleIcon,
  PlusCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import type { KeyboardEvent } from "react"
import { useRef, useState } from "react"

import type { ParticipaType } from "@/participa"
import { AddParticipanteCard } from "@/participa"
import type { ProyectoType } from "@/proyectos/types"
import { Button, HorizontalCard } from "@/ui"
import { parseDateToString } from "@/utils"

import { useEditProyectoForm } from "./useEditProyectoForm"

export type EditProyectoFormProps = {
  proyecto: ProyectoType
  finishEditMode: () => void
  participaciones: ParticipaType[]
  onUpdate: (proyecto?: ProyectoType, participa?: ParticipaType[]) => void
  unSync?: boolean
}

export const EditProyectoForm = ({
  proyecto,
  finishEditMode,
  participaciones,
  onUpdate,
  unSync,
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
  } = useEditProyectoForm(
    proyecto,
    finishEditMode,
    onUpdate,
    participaciones,
    unSync
  )
  // TODO: tech debt, get all logic inside hook
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

  const closeMenuOnClick = () => {
    if (isAddingParticipante) setIsAddingParticipante(false)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <form
      className="flex flex-col gap-2 my- w-full pt-3 px-7 pb-2"
      onClick={closeMenuOnClick}
      onSubmit={onSubmit}
    >
      {unSync && (
        <>
          {errors.codigo && (
            <span style={{ color: "red" }}>{errors.codigo}</span>
          )}
          <label className="flex flex-col w-full" htmlFor="codigo">
            <strong>Codigo Proyecto: </strong>
            <input
              id="codigo"
              name="codigo"
              type="text"
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              ref={startingInput}
              placeholder="Codigo del proyecto"
              defaultValue={editedProyecto.codigo}
              onChange={handleChange}
              onKeyDown={startingInputOnKeyPress}
            />
          </label>
        </>
      )}
      {errors.ip && <span style={{ color: "red" }}>{errors.ip}</span>}
      <label className="flex flex-col w-full" htmlFor="ip">
        <strong>Investigador Principal: </strong>
        <input
          id="ip"
          name="ip"
          type="text"
          required
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!unSync}
          ref={!unSync ? startingInput : undefined}
          placeholder="Investigador Principal"
          defaultValue={editedProyecto.ip}
          onChange={handleChange}
          onKeyDown={startingInputOnKeyPress}
        />
      </label>
      {errors.coip && <span style={{ color: "red" }}>{errors.coip}</span>}
      <label className="flex flex-col w-full" htmlFor="coip">
        <strong>Co Investigador Principal: </strong>
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
          <strong>Descripcion: </strong>
        </h3>
        <textarea
          className="min-h-28 max-h-72"
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
        <strong>Financiado:</strong>
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
          <strong>Inicio:</strong>
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
          <strong>Fin:</strong>
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
        {/* TODO: refactor this together with create form */}
        <div className="flex flex-row mt-5 gap-2">
          <UsersIcon className="w-4" />
          <strong>Participantes</strong>
        </div>
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
                >
                  <Button
                    variant="minimal"
                    className="rounded-3xl p-0"
                    onClick={() => removeParticipa(participa)}
                    ariaLabel={`Eliminar participación de ${participa.nombreAutor}`}
                  >
                    <MinusCircleIcon className="h-[34px] w-[34px] text-error hover:text-error-accent bg-secondary rounded-full" />
                  </Button>
                </HorizontalCard>
              </div>
            ))}
          </div>
        )}
        <div className="relative">
          {isAddingParticipante && (
            <AddParticipanteCard
              participaAdded={participaciones}
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
            ariaLabel="Añadir participante al proyecto"
          >
            <PlusCircleIcon className="h-[40px] w-[40px] text-primary bg-secondary rounded-full hover:text-primary-strong" />
          </Button>
        </div>
      </div>
      <div className="flex justify-around">
        <Button type="submit">Editar</Button>
        <Button
          type="button"
          onClick={finishEditMode}
          onKeyDown={cancelarButtonOnKeyPress}
          ref={cancelButton}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
