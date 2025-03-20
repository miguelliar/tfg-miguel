import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"

import type { ProyectoType, ProyectoValidationErrors } from "@/app/utils"
import { addProyecto, getProyectoErrors } from "@/app/utils"

const validateParameters = (
  proyecto: ProyectoType,
  setErrors: (errors: any) => void
) => {
  const errors = getProyectoErrors(proyecto)

  setErrors(errors)

  return (
    !errors.ip &&
    !errors.coip &&
    !errors.titulo &&
    !errors.financiado &&
    !errors.fechaInicio &&
    !errors.fechaFin
  )
}

export const useProyectoCreate = (): [
  ProyectoValidationErrors | null | undefined,
  handleChange: (e: any) => void,
  (e: any) => void,
] => {
  const [proyecto, setEditedProyecto] = useState({
    codigo: "",
    ip: "",
    coip: "",
    titulo: "",
    financiado: "",
    inicio: new Date(),
  })
  const [errors, setErrors] = useState<ProyectoValidationErrors | null>()
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditedProyecto((prevData) => ({
      ...prevData,
      [name]: typeof value === "string" ? value.trim() : value,
    }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateParameters(proyecto, setErrors)) {
      addProyecto(proyecto)
      router.replace("proyectos")
    }
  }

  return [errors, handleChange, onSubmit]
}
