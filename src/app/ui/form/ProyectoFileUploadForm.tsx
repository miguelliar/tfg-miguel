"use client"

import type { FormEvent } from "react"
import { useCallback, useMemo, useState } from "react"

import { addAllProyectos } from "@/app/utils/addAllProyectos"
import { onFileChange } from "@/app/utils/fetchProject"
import type { ProyectoToUpload } from "@/app/utils/mapProyecto"
import { mapProyectoToUploadToProyectType } from "@/app/utils/mapProyecto"

import { ProjectTable } from "../tables/ProjectTable"

export const ProyectoFileUploaderForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoToUpload[]>()
  const [errorMessages, setErrorMessages] = useState<string[]>()

  const onChange = useCallback(
    (selectedFile: any) =>
      onFileChange(selectedFile, setUploadedProyecto, setIsLoading),
    []
  )
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadedProyecto) {
        const proyectErrorMessageMap = await addAllProyectos(
          mapProyectoToUploadToProyectType(uploadedProyecto)
        )
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
      <form className="CreateForm" onSubmit={(e) => onSubmit(e)}>
        <label htmlFor="proyectoFile">
          Elige un archivo .csv con los proyectos a subir
          <input
            type="file"
            id="proyectoFile"
            name="proyectoFile"
            onChange={(event) => onChange(event.target.files?.[0])}
          />
        </label>
        <button type="submit" className="bg-blue-700" disabled={submitEnabled}>
          Submit
        </button>
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
      {!isLoading && uploadedProyecto ? (
        <ProjectTable
          projectData={mapProyectoToUploadToProyectType(uploadedProyecto)}
        />
      ) : null}
    </>
  )
}
