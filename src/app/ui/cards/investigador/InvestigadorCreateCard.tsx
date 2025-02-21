"use client"

/* eslint-disable jsx-a11y/no-static-element-interactions */
import { XMarkIcon } from "@heroicons/react/24/solid"

import { useInvestigadorCreate } from "./useInvestigadorCreate"

export const InvestigadorCreateCard = ({
  onClose,
}: {
  onClose: () => void
}) => {
  const [investigador, errors, onSubmit, handleChange] =
    useInvestigadorCreate(onClose)

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
        <div className="flex flex-col justify-around mx-8 items-center w-fit">
          <h2 className="text-special-color">Email: {investigador.email}</h2>
          <form
            className="flex flex-col gap-2 my-3 w-64"
            onSubmit={(e) => onSubmit(e)}
          >
            {errors?.email && (
              <span style={{ color: "red" }}>{errors.email}</span>
            )}
            <label htmlFor="email" className="flex flex-col">
              <b>Email: </b>
              <input
                id="email"
                name="email"
                type="text"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                placeholder="Email de investigador"
                onChange={handleChange}
              />
            </label>
            {errors?.nombre && (
              <span style={{ color: "red" }}>{errors.nombre}</span>
            )}
            <label htmlFor="nombre" className="flex flex-col">
              <b>Nombre: </b>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Nombre de investigador"
                onChange={handleChange}
              />
            </label>
            {errors?.apellidos && (
              <span style={{ color: "red" }}>{errors.apellidos}</span>
            )}
            <label htmlFor="apellidos" className="flex flex-col">
              <b>Apellidos: </b>
              <input
                id="apellidos"
                name="apellidos"
                type="text"
                required
                placeholder="Apellidos del investigador"
                onChange={handleChange}
              />
            </label>
            {errors?.universidad && (
              <span style={{ color: "red" }}>{errors.universidad}</span>
            )}
            <label htmlFor="universidad" className="flex flex-col">
              <h3 className="align-middle">
                <b>Universidad: </b>
              </h3>
              <input
                className="w-full"
                id="universidad"
                name="universidad"
                type="text"
                placeholder="Universidad del investigador"
                onChange={handleChange}
              />
            </label>
            {errors?.departamento && (
              <span style={{ color: "red" }}>{errors.departamento}</span>
            )}
            <label htmlFor="departamento" className="flex flex-col">
              <h3 className="align-middle">
                <b>Departamento: </b>
              </h3>
              <input
                className="w-full"
                id="departamento"
                name="departamento"
                type="text"
                placeholder="Departamento de la universidad"
                onChange={handleChange}
              />
            </label>
            {errors?.area && (
              <span style={{ color: "red" }}>{errors.area}</span>
            )}
            <label htmlFor="area" className="flex flex-col">
              <h3 className="align-middle">
                <b>Área: </b>
              </h3>
              <input
                className="w-full"
                id="area"
                name="area"
                type="text"
                placeholder="Area del departamento"
                onChange={handleChange}
              />
            </label>
            {errors?.figura && (
              <span style={{ color: "red" }}>{errors.figura}</span>
            )}
            <label htmlFor="figura" className="flex flex-col">
              <h3 className="align-middle">
                <b>Figura: </b>
              </h3>
              <input
                className="w-full"
                id="figura"
                name="figura"
                type="text"
                placeholder="Figura universitaria"
                onChange={handleChange}
              />
            </label>
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
