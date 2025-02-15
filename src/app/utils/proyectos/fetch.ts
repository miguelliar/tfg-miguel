/* eslint-disable no-console */
import type { ProyectoType } from "../types"
import type { ProyectoToUpload } from "./map"

export const fetchParsedProyectos = async (
  selectedFile: any
): Promise<ProyectoToUpload[] | undefined> => {
  try {
    const response = await fetch("/api/proyecto/parseFile", {
      method: "POST",
      body: selectedFile,
    })
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

export const downloadProyectosCSV = async (proyectos: ProyectoType[]) => {
  try {
    const response = await fetch("/api/proyecto/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proyectos),
    })
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "data.csv"
      link.click()
      window.URL.revokeObjectURL(url) // Clean up
    } else {
      console.error("Failed to download CSV")
    }
  } catch (error) {
    console.error(error)
  }
}
