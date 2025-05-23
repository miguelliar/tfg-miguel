"use client"

import { useRouter } from "next/navigation"

import { Button, SubmitStatusInfo } from "@/ui"

import { useInvestigadorCreate } from "./useInvestigadorCreate"

export const InvestigadorCreateForm = () => {
  const { errors, onSubmit, handleChange } = useInvestigadorCreate()

  const router = useRouter()

  const isUnexpectedError = typeof errors === "string"

  return (
    <div className="flex flex-col mb-8">
      <form
        className="flex flex-col gap-2 my-3 w-64"
        onSubmit={(e) => onSubmit(e)}
      >
        {!isUnexpectedError && errors?.email && (
          <span style={{ color: "red" }}>{errors.email}</span>
        )}
        <label htmlFor="email" className="flex flex-col">
          <strong>Email: </strong>
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
        {!isUnexpectedError && errors?.nombre && (
          <span style={{ color: "red" }}>{errors.nombre}</span>
        )}
        <label htmlFor="nombre" className="flex flex-col">
          <strong>Nombre: </strong>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Nombre de investigador"
            onChange={handleChange}
          />
        </label>
        {!isUnexpectedError && errors?.apellidos && (
          <span style={{ color: "red" }}>{errors.apellidos}</span>
        )}
        <label htmlFor="apellidos" className="flex flex-col">
          <strong>Apellidos: </strong>
          <input
            id="apellidos"
            name="apellidos"
            type="text"
            required
            placeholder="Apellidos del investigador"
            onChange={handleChange}
          />
        </label>
        {!isUnexpectedError && errors?.universidad && (
          <span style={{ color: "red" }}>{errors.universidad}</span>
        )}
        <label htmlFor="universidad" className="flex flex-col">
          <strong>Universidad: </strong>
          <input
            className="w-full"
            id="universidad"
            name="universidad"
            type="text"
            placeholder="Universidad del investigador"
            onChange={handleChange}
          />
        </label>
        {!isUnexpectedError && errors?.departamento && (
          <span style={{ color: "red" }}>{errors.departamento}</span>
        )}
        <label htmlFor="departamento" className="flex flex-col">
          <strong>Departamento: </strong>
          <input
            className="w-full"
            id="departamento"
            name="departamento"
            type="text"
            placeholder="Departamento de la universidad"
            onChange={handleChange}
          />
        </label>
        {!isUnexpectedError && errors?.area && (
          <span style={{ color: "red" }}>{errors.area}</span>
        )}
        <label htmlFor="area" className="flex flex-col">
          <strong>Área: </strong>
          <input
            className="w-full"
            id="area"
            name="area"
            type="text"
            placeholder="Area del departamento"
            onChange={handleChange}
          />
        </label>
        {!isUnexpectedError && errors?.figura && (
          <span style={{ color: "red" }}>{errors.figura}</span>
        )}
        <label htmlFor="figura" className="flex flex-col">
          <strong>Figura: </strong>
          <input
            className="w-full"
            id="figura"
            name="figura"
            type="text"
            placeholder="Figura universitaria"
            onChange={handleChange}
          />
        </label>
        <div className="flex justify-around mt-5">
          <Button type="submit">Crear investigador</Button>
        </div>
      </form>
      {isUnexpectedError && errors && (
        <SubmitStatusInfo
          submittedStatus="error"
          onCloseSubmitMessage={() => router.refresh()}
          messages={{
            onFailure:
              "Ha habido un error inesperado al añadir el investigador. Por favor, inténtalo de nuevo",
          }}
        />
      )}
    </div>
  )
}
