"use client"

import type { FormEvent } from "react"
import { useCallback, useMemo, useReducer } from "react"

import type { InfoMessage, ProyectoFileState, ProyectoType } from "@/app/utils"
import {
  addAllProyectos,
  defaultProyectoFileState,
  fetchParsedProyectos,
  mapProyectoToUploadToProyectType,
  ProyectoFileActions,
  proyectoFileUpdateReducer,
  validateProyectosToAdd,
} from "@/app/utils"

type ProyectoFileUploadFields = {
  informationMessages: InfoMessage[] | undefined
  isLoading: boolean
  isValidateEnabled: boolean
  isSubmitEnabled: boolean
  onChange: (selectedFile: any) => void
  onCloseSubmitMessage: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  onValidate: () => void
  submittedStatus: ProyectoFileState["submittedStatus"]
  uploadedProyecto?: ProyectoType[]
}

/**
 * Hook for ProyectoFileUploadForm that returns and processes all logic for this component to work
 * @returns {ProyectoFileUploadFields} Fields required for the component to work
 */
export const useProyectoFileUpload = (): ProyectoFileUploadFields => {
  const [state, dispatch] = useReducer(
    proyectoFileUpdateReducer,
    defaultProyectoFileState
  )
  const isValidateEnabled = useMemo(() => {
    return state.uploadedProyecto.length > 0
  }, [state])

  const onCloseSubmitMessage = useCallback(
    () => dispatch({ type: ProyectoFileActions.CLOSE_SUBMIT_MESSAGE }),
    [dispatch]
  )

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      addAllProyectos(state.uploadedProyecto)
      dispatch({ type: ProyectoFileActions.SUBMIT_SUCCESS })
    },
    [state, dispatch]
  )

  const onChange = useCallback(
    (selectedFile: any) => {
      dispatch({ type: ProyectoFileActions.UPLOAD })
      ;(async () => {
        const proyectoRaw = await fetchParsedProyectos(selectedFile)
        if (proyectoRaw && proyectoRaw.length > 0) {
          const formattedProyectos =
            mapProyectoToUploadToProyectType(proyectoRaw)

          dispatch({
            type: ProyectoFileActions.UPLOAD_SUCCESS,
            payload: formattedProyectos,
          })
        } else {
          dispatch({ type: ProyectoFileActions.UPLOAD_FAIL })
        }
      })()
    },
    [dispatch]
  )

  const onValidate = useCallback(() => {
    if (state.uploadedProyecto.length > 1) {
      validateProyectosToAdd(state.uploadedProyecto).then((messages) => {
        dispatch({ type: ProyectoFileActions.VALIDATE, payload: messages })
      })
    }
  }, [state, dispatch])

  return {
    isValidateEnabled,
    isSubmitEnabled: state.isSubmitEnabled,
    isLoading: state.isLoadingFiles,
    informationMessages: state.informationMessages,
    uploadedProyecto: state.uploadedProyecto,
    submittedStatus: state.submittedStatus,
    onSubmit,
    onChange,
    onValidate,
    onCloseSubmitMessage,
  }
}
