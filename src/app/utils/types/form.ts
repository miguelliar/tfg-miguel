import type { HTMLInputTypeAttribute } from "react"

export type FormField = {
  id: string
  label: string
  type: HTMLInputTypeAttribute
  required: boolean
  placeholder: string
}

export type FormParams = {
  submitCallback: (formData: FormData) => Promise<void>
  fields: FormField[]
  submitText: string
}
