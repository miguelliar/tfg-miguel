"use client"

import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import { AddParticipaCommand, type ParticipaType } from "@/participa"
import type { ProyectoType } from "@/proyectos/types"
import type { ProyectoValidationErrors } from "@/proyectos/utils"
import { addProyecto, getProyectoErrors } from "@/proyectos/utils"

const validateParameters = async (
  proyecto: ProyectoType,
  setErrors: (errors: any) => void
) => {
  const errors = await getProyectoErrors(proyecto)
  setErrors(errors)

  return (
    !errors.codigo &&
    !errors.ip &&
    !errors.coip &&
    !errors.titulo &&
    !errors.financiado &&
    !errors.fechaInicio &&
    !errors.fechaFin
  )
}

export const useProyectoCreate = (): {
  codigo: string
  addedParticipantes: ParticipaType[]
  errors: ProyectoValidationErrors | null | undefined
  handleChange: (e: any) => void
  onSubmit: (e: any) => void
  addParticipa: (participa: ParticipaType) => void
  removeParticipa: (participa: ParticipaType) => void
} => {
  const [addedParticipantes, setAddedParticipantes] = useState<ParticipaType[]>(
    []
  )
  const [proyecto, setEditedProyecto] = useState<ProyectoType>({
    codigo: "",
    ip: "",
    coip: "",
    titulo: "",
    financiado: "",
    inicio: new Date(),
  })
  const [errors, setErrors] = useState<ProyectoValidationErrors | null>()
  const router = useRouter()

  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      if (name === "codigo") {
        setAddedParticipantes(
          addedParticipantes.map((participante) => ({
            ...participante,
            codigo: value,
          }))
        )
      }

      setEditedProyecto((prevData) => ({
        ...prevData,
        [name]: typeof value === "string" ? value.trim() : value,
      }))
    },
    400
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateParameters(proyecto, setErrors).then((isValid) => {
      if (isValid) {
        addProyecto(proyecto).then(() => {
          // In order to wait to the proyecto for being created
          addedParticipantes
            .map((participa) => new AddParticipaCommand(participa))
            .forEach((command) => command.execute())
          router.push("/proyectos")
        })
      }
    })
  }

  const addParticipa = (addedParticipa: ParticipaType) => {
    setAddedParticipantes([...addedParticipantes, addedParticipa])
  }

  const removeParticipa = (removedParticipa: ParticipaType) => {
    setAddedParticipantes(
      addedParticipantes.filter(
        (participa) => participa.email !== removedParticipa.email
      )
    )
  }

  return {
    codigo: proyecto.codigo,
    addedParticipantes,
    errors,
    handleChange,
    onSubmit,
    addParticipa,
    removeParticipa,
  }
}
