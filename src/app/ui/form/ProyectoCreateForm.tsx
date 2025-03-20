"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */

import { parseDateToString } from "@/app/utils"

import { useProyectoCreate } from "./useProyectoCreate"

export const ProyectoCreate = () => {
  const [errors, handleChange, onSubmit] = useProyectoCreate()

  return (
    <div className="flex flex-col max-w-fit m-6">
      <h2 className="text-2xl text-special-color">Crear Proyecto</h2>
      <form className="flex flex-col gap-2 my-3" onSubmit={(e) => onSubmit(e)}>
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
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
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
          <h3 className="align-middle">
            <b>Descripcion: </b>
          </h3>
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
        <div className="flex justify-around">
          <button type="submit">Añadir</button>
        </div>
      </form>
    </div>
  )
}
