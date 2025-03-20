"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import type { ParticipaCommand, ParticipaType, ProyectoType } from "@/app/utils"
import { AddParticipaCommand, DeleteParticipaCommand } from "@/app/utils"
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

export type EditProyectoFormHookReturn = {
  editedProyecto: ProyectoType
  errors: typeof inputErrors
  editedParticipaciones: ParticipaType[]
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onSubmit: (e: any) => void
  addParticipa: (participa: ParticipaType) => void
  removeParticipa: (participa: ParticipaType) => void
}

export const useEditProyectoForm = (
  proyecto: ProyectoType,
  finishEditMode: () => void,
  participaciones: ParticipaType[]
): EditProyectoFormHookReturn => {
  const [editedParticipaciones, setEditedParticipaciones] =
    useState(participaciones)
  const [editedProyecto, setEditedProyecto] = useState(proyecto)
  const [participaChanges, setParticipaChanges] = useState<ParticipaCommand[]>(
    []
  )
  const [errors, setErrors] = useState(inputErrors)
  const { refresh } = useRouter()

  useEffect(() => {
    if (participaciones.length > 0) setEditedParticipaciones(participaciones)
  }, [participaciones, setEditedParticipaciones])

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
    const hasProyectoChanged =
      JSON.stringify(proyecto) !== JSON.stringify(editedProyecto)
    const hasParticipacionesChanged =
      JSON.stringify(participaciones) !== JSON.stringify(participaChanges)
    if (hasProyectoChanged || hasParticipacionesChanged) {
      if (validateParameters(editedProyecto, setErrors)) {
        updateProyectoItem(editedProyecto)
      }
      if (hasParticipacionesChanged) {
        participaChanges.forEach(async (participaChange) =>
          participaChange.execute()
        )
      }
      finishEditMode()
      refresh()
    }
  }

  const addParticipa = (participa: ParticipaType) => {
    setEditedParticipaciones([...editedParticipaciones, participa])
    setParticipaChanges([
      ...participaChanges,
      new AddParticipaCommand(participa),
    ])
  }

  const removeParticipa = (participa: ParticipaType) => {
    setEditedParticipaciones(
      editedParticipaciones.filter(
        (participacion) => participacion.email !== participa.email
      )
    )
    setParticipaChanges([
      ...participaChanges,
      new DeleteParticipaCommand(participa),
    ])
  }

  return {
    editedProyecto,
    errors,
    editedParticipaciones,
    handleChange,
    onSubmit,
    addParticipa,
    removeParticipa,
  }
}
