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

import { Button } from "../button/Button"
import { ProjectTable } from "../containers/tables/ProjectTable"
import { InformationMessage } from "../InformationMessage"

export const ProyectoFileUploaderForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoType[]>()
  const [informationMessages, setInformationMessages] =
    useState<InfoMessage[]>()
  const [submitDisabled, setSubmitDisabled] = useState(true)

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
        setSubmitDisabled(false)
      }
    }
  }, [uploadedProyecto, informationMessages])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadedProyecto && !submitDisabled) {
        addAllProyectos(uploadedProyecto)
      }
    },
    [uploadedProyecto, submitDisabled]
  )

  const validateDisabled = useMemo(() => {
    return !(uploadedProyecto && uploadedProyecto?.length > 0)
  }, [uploadedProyecto])

  return (
    <>
      <form className="m-7" onSubmit={(e) => onSubmit(e)}>
        <label className="flex flex-col" htmlFor="proyectoFile">
          <span>Elige un archivo .csv con los proyectos a subir</span>
          <input
            type="file"
            id="proyectoFile"
            name="proyectoFile"
            onChange={(event) => onChange(event.target.files?.[0])}
          />
        </label>
        <div className="flex flex-row">
          <Button
            type="button"
            variant="fill"
            className="m-4"
            onClick={onValidate}
            disabled={validateDisabled}
          >
            Validar
          </Button>
          <Button
            type="submit"
            variant="fill"
            className="m-4"
            disabled={submitDisabled}
          >
            Enviar
          </Button>
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
