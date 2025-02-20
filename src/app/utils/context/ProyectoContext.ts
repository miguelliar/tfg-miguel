"use client"

import type { Dispatch } from "react"
import { createContext } from "react"

import type { ProyectoType } from "../types"

type ProyectoEditAction = {
  type: "proyecto/edit"
  payload: ProyectoType
}

type ProyectosSetAction = {
  type: "proyecto/set"
  payload: ProyectoType[]
}

export type ProyectoAction = ProyectoEditAction | ProyectosSetAction

export const proyectoReducer = (
  proyectos: ProyectoType[],
  action: ProyectoAction
) => {
  switch (action.type) {
    case "proyecto/edit":
      return [
        ...proyectos.filter(
          (proyecto) => proyecto.codigo !== action.payload.codigo
        ),
        action.payload,
      ]
    case "proyecto/set":
      return [...action.payload]
    default: {
      throw new Error(`Unkwonw action ${(action as any).type}`)
    }
  }
}

export const ProyectoContext = createContext<ProyectoType[] | null>(null)

export const ProyectoDispatchContext =
  createContext<Dispatch<ProyectoAction> | null>(null)

export const ProyectoIsDBSyncContext = createContext(false)
