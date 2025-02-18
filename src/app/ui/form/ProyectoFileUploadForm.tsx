"use client"

import type { FormEvent } from "react"
import { useCallback, useMemo, useState } from "react"

import type { InfoMessage, ProyectoType } from "@/app/utils"
import {
  addAllProyectos,
  fetchParsedProyectos,
  InfoMessageType,
  mapProyectoToUploadToProyectType,
  MESSAGES,
  validateProyectosToAdd,
} from "@/app/utils"

import { ProjectTable } from "../containers/tables/ProjectTable"
import { InformationMessage } from "../InformationMessage"

export const ProyectoFileUploaderForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoType[]>()
  const [informationMessages, setInformationMessages] =
    useState<InfoMessage[]>()
  const [submitEnabled, setSubmitEnabled] = useState(false)

  const onChange = useCallback((selectedFile: any) => {
    setIsLoading(true)
    ;(async () => {
      const proyectoRaw = await fetchParsedProyectos(selectedFile)
      if (proyectoRaw && proyectoRaw.length > 0) {
        setUploadedProyecto(mapProyectoToUploadToProyectType(proyectoRaw))
      } else {
        setUploadedProyecto([])
        setInformationMessages([
          { type: InfoMessageType.FILE_ERROR, message: MESSAGES.FILE },
        ])
      }
      setIsLoading(false)
    })()
  }, [])

  const onValidate = useCallback(() => {
    if (uploadedProyecto) {
      validateProyectosToAdd(uploadedProyecto).then((messages) => {
        setInformationMessages(messages)
      })

      if (
        informationMessages?.some?.(
          (message) => message.type !== InfoMessageType.FILE_ERROR
        )
      ) {
        setSubmitEnabled(true)
      }
    }
  }, [uploadedProyecto, informationMessages])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadedProyecto && submitEnabled) {
        addAllProyectos(uploadedProyecto)
      }
    },
    [uploadedProyecto, submitEnabled]
  )

  const validateEnabled = useMemo(() => {
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
            type="button"
            className="m-4 bg-font-color text-background-color p-2 rounded-md"
            onClick={onValidate}
            disabled={validateEnabled}
          >
            Validate
          </button>
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
      {informationMessages && informationMessages.length > 0 ? (
        <InformationMessage informationMessage={informationMessages} />
      ) : null}
      {!isLoading && uploadedProyecto && uploadedProyecto.length > 0 ? (
        <ProjectTable projectData={uploadedProyecto} />
      ) : null}
    </>
  )
}
