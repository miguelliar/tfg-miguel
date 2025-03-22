"use client"

import { useRouter } from "next/router"
import { useState } from "react"

import type {
  InvestigadorType,
  InvestigadorValidationErrors,
} from "@/app/utils"
import {
  addInvestigador,
  getInvestigadorErrors,
  validateInvestigadorErrors,
} from "@/app/utils"

const validateParameters = (
  investigador: InvestigadorType,
  setErrors: (errors: any) => void
) => {
  const newErrors = getInvestigadorErrors(investigador)

  setErrors(newErrors)

  return validateInvestigadorErrors(newErrors)
}

export const useInvestigadorCreate = (): {
  errors: InvestigadorValidationErrors | null | undefined
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
  const [errors, setErrors] = useState()

  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setInvestigador((prevData) => ({
      ...prevData,
      [name]: typeof value === "string" ? value.trim() : value,
    }))
  }

  const onSubmit = () => {
    if (validateParameters(investigador, setErrors)) {
      addInvestigador(investigador)
      router.push("/investigador")
    }
  }

  return { errors, onSubmit, handleChange }
}
