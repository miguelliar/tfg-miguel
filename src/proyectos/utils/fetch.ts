/* eslint-disable no-console */
import {
  fetchCodeAndTitleProyectoByQuery,
  fetchCodeAndTitleProyectoData,
  fetchProyectosByCodigos,
} from "@/db"

import type { ProyectoToUpload } from "./map"

export const fetchProyectosMinimumData = async (
  query?: string,
  currentPage: number = 1
) => {
  return query
    ? fetchCodeAndTitleProyectoByQuery(query, currentPage)
    : fetchCodeAndTitleProyectoData(currentPage)
}

/**
 * Calls endpoint with a csv file in the body that will return its content parsed in a JSON
 * @param selectedFile
 * @returns
 */
export const fetchParsedProyectos = async (
  selectedFile: any
): Promise<ProyectoToUpload[] | undefined> => {
  try {
    const body = new FormData()
    body.set("proyectoFile", selectedFile)

    const response = await fetch("/api/proyecto/parseFile", {
      method: "POST",
      body,
    })
    return await response.json()
  } catch (error) {
    // TODO: Improve error handling and give more descriptive error
    console.error(error)
  }
}

/**
 * Calls endpoint to download a CSV file with the proyectos sent as parameter
 * @param proyectos
 */
export const downloadProyectosCSV = async (codigos: string[]) => {
  try {
    // fetch from DB
    const proyectos = await fetchProyectosByCodigos(codigos)
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
    // TODO: improve error handling
    console.error(error)
  }
}
