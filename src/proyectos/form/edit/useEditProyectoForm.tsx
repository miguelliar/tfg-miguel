"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { fetchProyectoByCode } from "@/db"
import {
  AddParticipaCommand,
  DeleteParticipaCommand,
  type ParticipaCommand,
  type ParticipaType,
} from "@/participa"
import type { ProyectoType } from "@/proyectos/types"

// TODO: Extract funtion
const validateParameters = async (
  proyecto: ProyectoType,
  setErrors: (errors: any) => void
) => {
  const newErrors = {
    codigo: "",
    ip: "",
    coip: "",
    titulo: "",
    financiado: "",
    fechaInicio: "",
    fechaFin: "",
  }

  const codigoAlreadyUsed = (await fetchProyectoByCode(proyecto.codigo))?.codigo

  if (codigoAlreadyUsed) {
    newErrors.codigo = `El codigo ${codigoAlreadyUsed} ya está siendo usado como código en otro proyecto`
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
      "La fecha de finalización no puede ser anterior a la de inicio"

  setErrors(newErrors)

  return (
    !newErrors.codigo &&
    !newErrors.ip &&
    !newErrors.coip &&
    !newErrors.titulo &&
    !newErrors.financiado &&
    !newErrors.fechaInicio &&
    !newErrors.fechaFin
  )
}

const inputErrors = {
  codigo: "",
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
  onUpdate: (proyecto?: ProyectoType, participa?: ParticipaType[]) => void,
  participaciones: ParticipaType[],
  unSync?: boolean
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
      JSON.stringify(participaciones) !== JSON.stringify(editedParticipaciones)
    if (hasProyectoChanged || hasParticipacionesChanged) {
      validateParameters(editedProyecto, setErrors)
        .then((isValid) => {
          if (unSync) {
            onUpdate(editedProyecto, editedParticipaciones)
          } else {
            if (isValid) {
              onUpdate(editedProyecto, editedParticipaciones)
            }
            if (hasParticipacionesChanged && !unSync) {
              participaChanges.forEach(async (participaChange) =>
                participaChange.execute()
              )
            }
          }
        })
        .finally(() => {
          finishEditMode()
          refresh()
        })
    }
  }

  const addParticipa = (participa: ParticipaType) => {
    setEditedParticipaciones([...editedParticipaciones, participa])
    if (!unSync)
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
    if (!unSync)
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
