"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */

import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

import { AddParticipanteCard } from "@/participa"
import { Button, HorizontalCard } from "@/ui"
import { parseDateToString } from "@/utils"

import { useProyectoCreate } from "./useProyectoCreate"

export const ProyectoCreate = () => {
  const {
    codigo,
    addedParticipantes,
    errors,
    handleChange,
    onSubmit,
    addParticipa,
    removeParticipa,
  } = useProyectoCreate()

  const [isAddingParticipante, setIsAddingParticipante] = useState(false)

  const closeMenuOnClick = () => {
    if (isAddingParticipante) setIsAddingParticipante(false)
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className="flex flex-col items-center w-full mb-8"
      onClick={closeMenuOnClick}
    >
      <form className="flex flex-col gap-2 mx-3" onSubmit={(e) => onSubmit(e)}>
        {errors?.codigo && (
          <span style={{ color: "red" }}>{errors.codigo}</span>
        )}
        <label className="flex flex-col w-full" htmlFor="codigo">
          <b>Codigo: </b>
          <input
            id="codigo"
            name="codigo"
            type="text"
            required
            placeholder="Codigo"
            onChange={handleChange}
          />
        </label>
        {errors?.ip && <span style={{ color: "red" }}>{errors.ip}</span>}
        <label className="flex flex-col w-full" htmlFor="ip">
          <b>Investigador Principal: </b>
          <input
            id="ip"
            name="ip"
            type="text"
            required
            placeholder="Investigador Principal"
            onChange={handleChange}
          />
        </label>
        {errors?.coip && <span style={{ color: "red" }}>{errors.coip}</span>}
        <label className="flex flex-col w-full" htmlFor="coip">
          <b>Co Investigador Principal: </b>
          <input
            id="coip"
            name="coip"
            type="text"
            placeholder="Co Investigador Principal"
            onChange={handleChange}
          />
        </label>
        {errors?.titulo && (
          <span style={{ color: "red" }}>{errors.titulo}</span>
        )}
        <label className="flex flex-col w-full" htmlFor="titulo">
          <b>Descripcion: </b>
          <textarea
            id="titulo"
            name="titulo"
            placeholder="Titulo"
            onChange={handleChange}
          />
        </label>
        {errors?.financiado && (
          <span style={{ color: "red" }}>{errors.financiado}</span>
        )}
        <label className="flex flex-col w-full" htmlFor="financiado">
          <b>Financiado:</b>
          <textarea
            id="financiado"
            name="financiado"
            placeholder="Financiado"
            onChange={handleChange}
          />
        </label>
        {errors?.fechaInicio && (
          <span style={{ color: "red" }}>{errors.fechaInicio}</span>
        )}
        {errors?.fechaFin && (
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
              defaultValue={parseDateToString(new Date())}
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
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="flex flex-col justify-start items-center">
          <b className="mt-5">Participantes</b>
          <div className="flex flex-col gap-2 overflow-auto mt-2">
            {addedParticipantes.map((participa) => (
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
          <div className="relative">
            {isAddingParticipante && (
              <AddParticipanteCard
                codigo={codigo}
                onAdd={addParticipa}
                onClose={() => setIsAddingParticipante(false)}
                participaAdded={addedParticipantes}
              />
            )}
            <Button
              onClick={() => {
                setIsAddingParticipante(true)
              }}
              variant="minimal"
              className="rounded-3xl p-0"
              ariaLabel="Añadir participante"
            >
              <PlusCircleIcon className="h-[40px] w-[40px] text-primary bg-secondary rounded-full" />
            </Button>
          </div>
        </div>
        <div className="flex justify-around mt-5">
          <Button type="submit">Crear proyecto</Button>
        </div>
      </form>
    </div>
  )
}
