import React, { useState } from "react"

// TODO: improve this file and use it to both Proyecto and Investigador
interface Element {
  [key: string]: string
}

interface ValidationRules {
  [key: string]: (value: string) => string | null
}

interface FormProps {
  element: Element
}

const ElementForm: React.FC<FormProps> = ({ element }) => {
  const [formData, setFormData] = useState<Element>(element)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Define validation rules (extendable for other fields)
  const validationRules: ValidationRules = {
    name: (value: string) => {
      if (!value) return "Name cannot be empty"
      return null
    },
    endDate: (value: string) => {
      if (value && Number.isNaN(Date.parse(value)))
        return "End Date must be a valid date"
      return null
    },
    // You can add more rules for additional fields
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    Object.keys(formData).forEach((key) => {
      const error = validationRules[key]?.(formData[key]) || ""
      if (error) {
        newErrors[key] = error
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Handle form submission here
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label htmlFor={key}>{key}</label>
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
          {errors[key] && <span style={{ color: "red" }}>{errors[key]}</span>}
        </div>
      ))}

      <button type="submit" disabled={!validateForm()}>
        Submit
      </button>
    </form>
  )
}

export default ElementForm
