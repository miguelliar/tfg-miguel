import type { InvestigadorType } from "@/app/utils"

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

  return (
    <form className="flex flex-col gap-2 my-3" onSubmit={(e) => onSubmit(e)}>
      {errors.nombre && <span style={{ color: "red" }}>{errors.nombre}</span>}
      <label htmlFor="nombre">
        <b>Nombre: </b>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Nombre de investigador"
          defaultValue={editedInvestigador.nombre}
          onChange={handleChange}
        />
      </label>
      {errors.apellidos && (
        <span style={{ color: "red" }}>{errors.apellidos}</span>
      )}
      <label htmlFor="apellidos">
        <b>Apellidos: </b>
        <input
          id="apellidos"
          name="apellidos"
          type="text"
          required
          placeholder="Apellidos del investigador"
          defaultValue={editedInvestigador.apellidos}
          onChange={handleChange}
        />
      </label>
      {errors.universidad && (
        <span style={{ color: "red" }}>{errors.universidad}</span>
      )}
      <label className="w-full" htmlFor="universidad">
        <h3 className="align-middle">
          <b>Universidad: </b>
        </h3>
        <input
          id="universidad"
          name="universidad"
          type="text"
          placeholder="Universidad del investigador"
          defaultValue={editedInvestigador.departamento}
          onChange={handleChange}
        />
      </label>
      {errors.departamento && (
        <span style={{ color: "red" }}>{errors.departamento}</span>
      )}
      <label className="w-full" htmlFor="departamento">
        <h3 className="align-middle">
          <b>Departamento: </b>
        </h3>
        <input
          id="departamento"
          name="departamento"
          type="text"
          placeholder="Departamento de la universidad"
          defaultValue={editedInvestigador.departamento}
          onChange={handleChange}
        />
      </label>
      {errors.area && <span style={{ color: "red" }}>{errors.area}</span>}
      <label className="w-full" htmlFor="area">
        <h3 className="align-middle">
          <b>Área: </b>
        </h3>
        <input
          id="area"
          name="area"
          type="text"
          placeholder="Area del departamento"
          defaultValue={editedInvestigador.area}
          onChange={handleChange}
        />
      </label>
      {errors.figura && <span style={{ color: "red" }}>{errors.figura}</span>}
      <label className="w-full" htmlFor="figura">
        <h3 className="align-middle">
          <b>Figura: </b>
        </h3>
        <input
          id="figura"
          name="figura"
          type="text"
          placeholder="Figura universitaria"
          defaultValue={editedInvestigador.figura}
          onChange={handleChange}
        />
      </label>
      <div className="flex justify-around">
        <button type="submit">Editar</button>
        <button type="button" onClick={finishEditMode}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
