"use client"

import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"

import type { InvestigadorType } from "@/investigadores/types"
import type { InvestigadorValidationErrors } from "@/investigadores/utils"
import {
  addInvestigador,
  getInvestigadorErrors,
  validateInvestigadorErrors,
} from "@/investigadores/utils"

const validateParameters = (
  investigador: InvestigadorType,
  setErrors: (errors: any) => void
) => {
  const newErrors = getInvestigadorErrors(investigador)

  setErrors(newErrors)

  return validateInvestigadorErrors(newErrors)
}

export const useInvestigadorCreate = (): {
  errors: InvestigadorValidationErrors | string
  onSubmit: (e: any) => void
  handleChange: (e: any) => void
} => {
  const [investigador, setInvestigador] = useState({
    email: "",
    nombre: "",
    apellidos: "",
    universidad: "",
    departamento: "",
    area: "",
    figura: "",
  })
  const [errors, setErrors] = useState<InvestigadorValidationErrors | string>(
    ""
  )

  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setInvestigador((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateParameters(investigador, setErrors)) {
      addInvestigador(investigador)
        .then(() => router.push("/investigadores"))
        .catch(() =>
          setErrors(
            "Ha habido un problema añadiendo el proyecto. Por favor, inténtalo de nuevo"
          )
        )
    }
  }

  return { errors, onSubmit, handleChange }
}
