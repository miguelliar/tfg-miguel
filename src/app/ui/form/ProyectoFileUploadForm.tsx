"use client"

import type { FormEvent } from "react"
import { useCallback, useMemo, useState } from "react"

import type { ProyectoType } from "@/app/utils"
import {
  addAllProyectos,
  fetchParsedProyectos,
  mapProyectoToUploadToProyectType,
} from "@/app/utils"

import { ProjectTable } from "../containers/tables/ProjectTable"

export const ProyectoFileUploaderForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoType[]>()
  const [errorMessages, setErrorMessages] = useState<string[]>()

  const onChange = useCallback((selectedFile: any) => {
    setIsLoading(true)
    ;(async () => {
      const proyectoRaw = await fetchParsedProyectos(selectedFile)
      if (proyectoRaw && proyectoRaw.length > 0) {
        setUploadedProyecto(mapProyectoToUploadToProyectType(proyectoRaw))
      } else {
        setUploadedProyecto([])
        setErrorMessages([
          "There was a problem with the file. Please try it again",
        ])
      }
      setIsLoading(false)
    })()
  }, [])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadedProyecto) {
        const proyectErrorMessageMap = await addAllProyectos(uploadedProyecto)
        if (proyectErrorMessageMap) {
          setErrorMessages(
            proyectErrorMessageMap.map(
              (proyectoErrorPair) =>
                `${proyectoErrorPair[0].codigo}: ${proyectoErrorPair[1]}`
            )
          )
        }
      }
    },
    [uploadedProyecto]
  )

  const submitEnabled = useMemo(() => {
    return !(uploadedProyecto && uploadedProyecto?.length > 0)
  }, [uploadedProyecto])

  return (
    <>
      <form className="ml-7" onSubmit={(e) => onSubmit(e)}>
        <label className="flex flex-col" htmlFor="proyectoFile">
          <span>Elige un archivo .csv con los proyectos a subir</span>
          <input
            type="file"
            id="proyectoFile"
            name="proyectoFile"
            onChange={(event) => onChange(event.target.files?.[0])}
          />
        </label>
        <div>
          <button
            type="submit"
            className="m-4 bg-font-color text-background-color p-2 rounded-md"
            disabled={submitEnabled}
          >
            Submit
          </button>
        </div>
      </form>
      <p>{isLoading ? "Loading" : null}</p>
      {errorMessages && errorMessages.length > 0 ? (
        <section>
          <h2>There has been the following problems:</h2>
          <ul>
            {errorMessages.map((errorMessage) => (
              <li key={`ErrorMessage-${errorMessage}`}>
                <p>{errorMessage}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {!isLoading && uploadedProyecto && uploadedProyecto.length > 0 ? (
        <ProjectTable projectData={uploadedProyecto} />
      ) : null}
    </>
  )
}
