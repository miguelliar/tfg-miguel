import type { ProyectoToUpload } from "../proyectos"

// ------ State ------
export type ProyectoFileState = {
  uploadedProyectos: ProyectoToUpload[]
  isSubmitEnabled: boolean
  isLoadingFiles: boolean
  apiError?: string
  submittedStatus?: "success" | "error"
}

export const defaultProyectoFileState: ProyectoFileState = {
  uploadedProyectos: [],
  isSubmitEnabled: false,
  isLoadingFiles: false,
}

// ------ Actions ------
export const ProyectoFileActions = {
  UPLOAD: "proyecto/file/upload" as const,
  UPLOAD_SUCCESS: "proyecto/file/upload/success" as const,
  UPLOAD_FAIL: "proyecto/file/upload/fail" as const,
  UPDATE_PROYECTO: "proyecto/file/update" as const,
  SOLVE_CONFLICT: "proyecto/file/solve_conflict" as const,
  CONFLICTS_SOLVED: "proyecto/file/conflicts_solved" as const,
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
  payload: ProyectoToUpload[]
}

type ProyectoFileUploadFailAction = {
  type: typeof ProyectoFileActions.UPLOAD_FAIL
}

type ProyectoFileUpdateProyecto = {
  type: typeof ProyectoFileActions.UPDATE_PROYECTO
  payload: ProyectoToUpload[]
}

type ProyectoFileSolveConflict = {
  type: typeof ProyectoFileActions.SOLVE_CONFLICT
  payload: ProyectoToUpload[]
}

type ProyectoFileConflictsSolved = {
  type: typeof ProyectoFileActions.CONFLICTS_SOLVED
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
  | ProyectoFileUpdateProyecto
  | ProyectoFileSolveConflict
  | ProyectoFileConflictsSolved
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
        uploadedProyectos: [],
        isLoadingFiles: true,
        isSubmitEnabled: false,
      }
    case ProyectoFileActions.UPLOAD_SUCCESS:
      return {
        ...state,
        apiError: undefined,
        isLoadingFiles: false,
        uploadedProyectos: action.payload,
      }
    case ProyectoFileActions.UPLOAD_FAIL:
      return {
        ...state,
        isLoadingFiles: false,
        apiError: "Se ha producido un error subiendo el archivo",
      }
    case ProyectoFileActions.UPDATE_PROYECTO:
      return {
        ...state,
        uploadedProyectos: action.payload,
      }
    case ProyectoFileActions.SOLVE_CONFLICT:
      return {
        ...state,
        uploadedProyectos: action.payload,
      }
    case ProyectoFileActions.CONFLICTS_SOLVED:
      return {
        ...state,
        isSubmitEnabled: true,
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
