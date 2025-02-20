"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { XMarkIcon } from "@heroicons/react/24/solid"

import { parseDateToString } from "@/app/utils"

import { useProyectoCreate } from "./useProyectoCreate"

export const ProyectoCreateCard = ({ onClose }: { onClose: () => void }) => {
  const [proyecto, errors, handleChange, onSubmit] = useProyectoCreate(onClose)

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
          <form
            className="flex flex-col gap-2 my-3"
            onSubmit={(e) => onSubmit(e)}
          >
            {errors?.codigo && (
              <span style={{ color: "red" }}>{errors.codigo}</span>
            )}
            <label htmlFor="codigo">
              <b>Codigo: </b>
              <input
                id="codigo"
                name="codigo"
                type="text"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                placeholder="Codigo"
                onChange={handleChange}
              />
            </label>
            {errors?.ip && <span style={{ color: "red" }}>{errors.ip}</span>}
            <label htmlFor="ip">
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
            {errors?.coip && (
              <span style={{ color: "red" }}>{errors.coip}</span>
            )}
            <label htmlFor="coip">
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
            <label className="w-full" htmlFor="titulo">
              <h3 className="align-middle">
                <b>Descripcion: </b>
              </h3>
              <textarea
                className=""
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
                  defaultValue={parseDateToString(proyecto.inicio)}
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
            <div className="flex justify-around">
              <button type="submit">Añadir</button>
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
