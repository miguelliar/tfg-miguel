"use client"

import { useState } from "react"

import type { ProyectoType } from "@/app/utils"
import { updateProyectoItem } from "@/db"

const validateParameters = (
  proyecto: ProyectoType,
  setErrors: (errors: any) => void
) => {
  const newErrors = {
    ip: "",
    coip: "",
    titulo: "",
    financiado: "",
    fechaInicio: "",
    fechaFin: "",
  }

  if (!proyecto.ip)
    newErrors.ip = "El investigador principal no puede estar vacío"
  if (proyecto.coip && proyecto.coip === proyecto.ip)
    newErrors.coip =
      "El co-investigador principal no ser el mismo que el investigador principal"
  if (!proyecto.titulo) newErrors.titulo = "El titulo no puede estar vacío"
  if (!proyecto.financiado)
    newErrors.financiado = "La financiación no puede estar vacía"
  if (!proyecto.inicio)
    newErrors.fechaInicio = "La fecha de inicio no puede estar vacío"
  if (
    proyecto.fin &&
    new Date(proyecto.fin).valueOf() < new Date(proyecto.inicio).valueOf()
  )
    newErrors.fechaFin =
      "El co-investigador principal no ser el mismo que el investigador principal"

  setErrors(newErrors)

  return (
    !newErrors.ip &&
    !newErrors.coip &&
    !newErrors.titulo &&
    !newErrors.financiado &&
    !newErrors.fechaInicio &&
    !newErrors.fechaFin
  )
}

const inputErrors = {
  ip: "",
  coip: "",
  titulo: "",
  financiado: "",
  fechaInicio: "",
  fechaFin: "",
}

export const useEditProyectoForm = (
  proyecto: ProyectoType,
  finishEditMode: () => void
): [
  ProyectoType,
  typeof inputErrors,
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (e: any) => void,
] => {
  const [editedProyecto, setEditedProyecto] = useState(proyecto)
  const [errors, setErrors] = useState(inputErrors)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditedProyecto((prevData) => ({
      ...prevData,
      [name]: typeof value === "string" ? value.trim() : value,
    }))
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (JSON.stringify(proyecto) !== JSON.stringify(editedProyecto)) {
      if (validateParameters(editedProyecto, setErrors)) {
        updateProyectoItem(editedProyecto)
        finishEditMode()
      }
    }
  }

  return [editedProyecto, errors, handleChange, onSubmit]
}
