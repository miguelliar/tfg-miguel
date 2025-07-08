"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useReducer } from "react"

import { AddParticipaCommand } from "@/participa"
import type { ProyectoToUpload } from "@/proyectos"
import {
  addAllProyectos,
  fetchParsedProyectos,
  mapProyectosToUploadToProyectsType,
  validateProyectoToAdd,
} from "@/proyectos"
import type { ProyectoFileState } from "@/utils"
import {
  defaultProyectoFileState,
  ProyectoFileActions,
  proyectoFileUpdateReducer,
} from "@/utils"

type ProyectoFileUploadFields = {
  isLoading: boolean
  isSubmitEnabled: boolean
  onChange: (selectedFile: any) => void
  onChangeProyecto: (
    updatedProyecto: ProyectoToUpload,
    previousCodigo: string
  ) => Promise<void>
  onCloseSubmitMessage: () => void
  onSolveConflict: (updatedProyecto: ProyectoToUpload) => void
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
        for (const proyecto of state.uploadedProyectos) {
          for (const participacion of proyecto.participantes) {
            // eslint-disable-next-line no-await-in-loop
            await new AddParticipaCommand(participacion).execute()
          }
        }
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

  const onSolveConflict = (removed: ProyectoToUpload) => {
    // removes the proyecto
    const updatedProyectos = state.uploadedProyectos.filter(
      (proyecto) => proyecto.codigo !== removed.codigo
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
