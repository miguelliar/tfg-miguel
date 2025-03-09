import type { InfoMessage } from "../proyectos"
import { InfoMessageType, MESSAGES } from "../proyectos"
import type { ProyectoType } from "../types"

// ------ State ------
export type ProyectoFileState = {
  uploadedProyecto: ProyectoType[]
  isSubmitEnabled: boolean
  isLoadingFiles: boolean
  informationMessages: InfoMessage[]
  submittedStatus?: "success" | "error"
}

export const defaultProyectoFileState: ProyectoFileState = {
  uploadedProyecto: [],
  isSubmitEnabled: false,
  isLoadingFiles: false,
  informationMessages: [],
}

// ------ Actions ------
export const ProyectoFileActions = {
  UPLOAD: "proyecto/file/upload" as const,
  UPLOAD_SUCCESS: "proyecto/file/upload/success" as const,
  UPLOAD_FAIL: "proyecto/file/upload/fail" as const,
  VALIDATE: "proyecto/file/validate" as const,
  SUBMIT: "proyecto/file/submit" as const,
  SUBMIT_WARNING: "proyecto/file/submit/warning" as const,
  SUBMIT_ERROR: "proyecto/file/submit/error" as const,
  SUBMIT_SUCCESS: "proyecto/file/submit/success" as const,
  CLOSE_SUBMIT_MESSAGE: "proyecto/file/submit/message/close" as const,
}

type ProyectoFileUpdloadAction = {
  type: typeof ProyectoFileActions.UPLOAD
}

type ProyectoFileUploadSuccessAction = {
  type: typeof ProyectoFileActions.UPLOAD_SUCCESS
  payload: ProyectoType[]
}

type ProyectoFileUploadFailAction = {
  type: typeof ProyectoFileActions.UPLOAD_FAIL
}

type ProyectoFileValidateAction = {
  type: typeof ProyectoFileActions.VALIDATE
  payload: InfoMessage[]
}

type ProyectoFileSubmitWarningAction = {
  type: typeof ProyectoFileActions.SUBMIT_WARNING
  payload: string
}

type ProyectoFileSubmitErrorAction = {
  type: typeof ProyectoFileActions.SUBMIT_ERROR
}

type ProyectosFileSubmitSuccessAction = {
  type: typeof ProyectoFileActions.SUBMIT_SUCCESS
}

type ProyectosFileCloseSubmitMessageAction = {
  type: typeof ProyectoFileActions.CLOSE_SUBMIT_MESSAGE
}

type ProyectosFileSubmitAction = {
  type: typeof ProyectoFileActions.SUBMIT
  payload: string[]
}

export type ProyectoFileAction =
  | ProyectoFileUpdloadAction
  | ProyectoFileUploadSuccessAction
  | ProyectoFileUploadFailAction
  | ProyectoFileValidateAction
  | ProyectosFileSubmitAction
  | ProyectoFileSubmitWarningAction
  | ProyectoFileSubmitErrorAction
  | ProyectosFileSubmitSuccessAction
  | ProyectosFileCloseSubmitMessageAction

// ------ Reducer ------
export const proyectoFileUpdateReducer = (
  state: ProyectoFileState,
  action: ProyectoFileAction
): ProyectoFileState => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { submittedStatus, ...persistedState } = state
  switch (action.type) {
    case ProyectoFileActions.UPLOAD:
      return {
        ...persistedState,
        uploadedProyecto: [],
        isLoadingFiles: true,
        isSubmitEnabled: false,
        informationMessages: [],
      }
    case ProyectoFileActions.UPLOAD_SUCCESS:
      return {
        ...state,
        isLoadingFiles: false,
        uploadedProyecto: action.payload,
      }
    case ProyectoFileActions.UPLOAD_FAIL:
      return {
        ...state,
        isLoadingFiles: false,
        informationMessages: [
          {
            type: InfoMessageType.FILE_ERROR,
            message: MESSAGES.FILE,
          },
        ],
      }
    case ProyectoFileActions.VALIDATE:
      return {
        ...state,
        isSubmitEnabled: true,
        informationMessages: action.payload,
      }
    // TODO: Add validation before submit
    /* case "proyecto/file/submit":
      return { ...state }
    case "proyecto/file/submit/warning":
      return { ...state } */
    case ProyectoFileActions.SUBMIT_ERROR:
      return { ...state, submittedStatus: "error" }
    case ProyectoFileActions.SUBMIT_SUCCESS:
      return { ...state, submittedStatus: "success" }
    case ProyectoFileActions.CLOSE_SUBMIT_MESSAGE:
      // eslint-disable-next-line no-case-declarations
      return { ...persistedState }
    default: {
      throw new Error(`Unkwonw action ${(action as any).type}`)
    }
  }
}
