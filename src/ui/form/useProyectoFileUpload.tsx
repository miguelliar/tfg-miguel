"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useReducer } from "react"
import { validateProyectoToAdd } from "utils"

import type { ProyectoFileState } from "@/app/utils"
import {
  defaultProyectoFileState,
  ProyectoFileActions,
  proyectoFileUpdateReducer,
} from "@/app/utils"
import type { ErrorMessage, ProyectoToUpload } from "@/proyectos"
import {
  addAllProyectos,
  fetchParsedProyectos,
  mapProyectosToUploadToProyectsType,
} from "@/proyectos"

type ProyectoFileUploadFields = {
  isLoading: boolean
  isSubmitEnabled: boolean
  onChange: (selectedFile: any) => void
  onChangeProyecto: (
    updatedProyecto: ProyectoToUpload,
    previousCodigo: string
  ) => Promise<void>
  onCloseSubmitMessage: () => void
  onSolveConflict: (
    updatedProyecto: ProyectoToUpload,
    errorMessage: ErrorMessage["message"]
  ) => void
  onSubmit: () => void
  submittedStatus: ProyectoFileState["submittedStatus"]
  errorMessage?: string
  uploadedProyectos?: ProyectoToUpload[]
  errorPresent: boolean
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

  const router = useRouter()

  // when uplodaded proyectos change its state and there are no error messages unread, set submit enabled
  useEffect(() => {
    if (
      !state.uploadedProyectos.some((proyecto: ProyectoToUpload) =>
        proyecto.messages.errors?.some((message) => !message.read)
      ) &&
      state.uploadedProyectos.length > 0
    ) {
      dispatch({
        type: ProyectoFileActions.CONFLICTS_SOLVED,
      })
    }
  }, [state.uploadedProyectos])

  const onCloseSubmitMessage = useCallback(() => {
    dispatch({ type: ProyectoFileActions.CLOSE_SUBMIT_MESSAGE })
    router.push("/proyectos")
  }, [router, dispatch])

  const onSubmit = useCallback(() => {
    ;(async () => {
      try {
        await addAllProyectos(
          mapProyectosToUploadToProyectsType(state.uploadedProyectos)
        )
        dispatch({ type: ProyectoFileActions.SUBMIT_SUCCESS })
      } catch (e) {
        dispatch({ type: ProyectoFileActions.SUBMIT_ERROR })
      }
    })()
  }, [state, dispatch])

  const onChange = useCallback(
    (selectedFile: any) => {
      dispatch({ type: ProyectoFileActions.UPLOAD })
      ;(async () => {
        const proyectoRaw = await fetchParsedProyectos(selectedFile)
        if (proyectoRaw && proyectoRaw.length > 0) {
          dispatch({
            type: ProyectoFileActions.UPLOAD_SUCCESS,
            payload: proyectoRaw,
          })
        } else {
          dispatch({ type: ProyectoFileActions.UPLOAD_FAIL })
        }
      })()
    },
    [dispatch]
  )

  const onSolveConflict = (
    updatedProyecto: ProyectoToUpload,
    errorMessage: ErrorMessage["message"]
  ) => {
    // updates state with read error message
    const updatedProyectos = state.uploadedProyectos.map<ProyectoToUpload>(
      (proyecto: ProyectoToUpload) => {
        if (proyecto.codigo !== updatedProyecto.codigo) {
          return proyecto
        }
        return {
          ...proyecto,
          messages: {
            ...proyecto.messages,
            errors: [
              ...(proyecto.messages.errors?.filter(
                (error) => error.message !== errorMessage
              ) ?? []),
              { message: errorMessage, read: true },
            ],
          },
        }
      }
    )

    // dispatches new state with solved error message
    dispatch({
      type: ProyectoFileActions.SOLVE_CONFLICT,
      payload: updatedProyectos,
    })
  }

  // Validates proyecto, changes messages and updates after editing it
  const onChangeProyecto = async (
    updatedProyecto: ProyectoToUpload,
    previousCodigo: string
  ) => {
    // validate changes and update warning/error messages
    validateProyectoToAdd(updatedProyecto).then((validatedProyecto) => {
      dispatch({
        type: ProyectoFileActions.UPDATE_PROYECTO,
        payload: state.uploadedProyectos.map((proyecto) => {
          if (proyecto.codigo === previousCodigo) {
            return validatedProyecto
          }
          return proyecto
        }),
      })
    })
  }

  return {
    isSubmitEnabled: state.isSubmitEnabled,
    isLoading: state.isLoadingFiles,
    uploadedProyectos: state.uploadedProyectos,
    errorMessage: state.apiError,
    submittedStatus: state.submittedStatus,
    errorPresent: state.uploadedProyectos?.some(
      (proyecto) => (proyecto.messages.errors?.length ?? 0) > 0
    ),
    onSubmit,
    onChange,
    onChangeProyecto,
    onSolveConflict,
    onCloseSubmitMessage,
  }
}
