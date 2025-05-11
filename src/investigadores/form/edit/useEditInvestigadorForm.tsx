"use client"

import { useState } from "react"

import { updateInvestigador } from "@/db"
import type { InvestigadorType } from "@/investigadores/types"

const validateParameters = (
  investigador: InvestigadorType,
  setErrors: (errors: any) => void
) => {
  const newErrors = {
    nombre: "",
    apellidos: "",
    universidad: "",
    departamento: "",
    area: "",
    figura: "",
  }

  if (!investigador.nombre)
    newErrors.nombre = "El nombre del investigador no puede estar vacío"
  if (!investigador.apellidos)
    newErrors.apellidos =
      "Los apellidos del investigador no pueden estar vacíos"
  if (!investigador.universidad)
    newErrors.universidad = "La universidad no puede estar vacía"
  if (!investigador.departamento)
    newErrors.departamento = "El departamento no puede estar vacío"
  if (!investigador.area) newErrors.area = "El area no puede estar vacía"
  if (!investigador.figura) newErrors.figura = "La figura no puede estar vacía"
  setErrors(newErrors)

  return (
    !newErrors.nombre &&
    !newErrors.apellidos &&
    !newErrors.universidad &&
    !newErrors.departamento &&
    !newErrors.area &&
    !newErrors.figura
  )
}

const inputErrors = {
  nombre: "",
  apellidos: "",
  universidad: "",
  departamento: "",
  area: "",
  figura: "",
}

export const useEditInvestigadorForm = (
  investigador: InvestigadorType,
  finishEditMode: () => void
): [
  InvestigadorType,
  typeof inputErrors,
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (e: any) => void,
] => {
  const [editedInvestigador, setEditedInvestigador] = useState(investigador)
  const [errors, setErrors] = useState(inputErrors)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditedInvestigador((prevData) => ({
      ...prevData,
      [name]: typeof value === "string" ? value.trim() : value,
    }))
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (JSON.stringify(investigador) !== JSON.stringify(editedInvestigador)) {
      if (validateParameters(editedInvestigador, setErrors)) {
        updateInvestigador(editedInvestigador)
        finishEditMode()
      }
    }
  }

  return [editedInvestigador, errors, handleChange, onSubmit]
}
