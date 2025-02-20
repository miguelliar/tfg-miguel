"use client"

import { useContext, useEffect, useReducer } from "react"

import type { ProyectoType } from "@/app/utils"
import {
  ProyectoContext,
  ProyectoDispatchContext,
  ProyectoIsDBSyncContext,
  proyectoReducer,
} from "@/app/utils"

import { ProyectoMiniCard } from "../../cards/proyecto/ProyectoMiniCard"

const ProyectoGridContent = () => {
  const proyectos = useContext(ProyectoContext)

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {proyectos &&
        proyectos.map((proyecto) => (
          <ProyectoMiniCard
            key={`ProyectoCard-${proyecto.codigo}`}
            proyecto={proyecto}
          />
        ))}
    </>
  )
}

export const ProyectoGrid = ({
  proyectos,
  isDBSync,
}: {
  proyectos: ProyectoType[]
  isDBSync?: boolean
}) => {
  const [proyectoContext, dispatch] = useReducer(
    proyectoReducer,
    proyectos ?? []
  )
  useEffect(() => {
    dispatch({ type: "proyecto/set", payload: proyectos })
  }, [proyectos])

  return (
    <div className="grid grid-cols-adaptable gap-4">
      <ProyectoContext.Provider value={proyectoContext}>
        <ProyectoDispatchContext.Provider value={dispatch}>
          <ProyectoIsDBSyncContext.Provider value={Boolean(isDBSync)}>
            <ProyectoGridContent />
          </ProyectoIsDBSyncContext.Provider>
        </ProyectoDispatchContext.Provider>
      </ProyectoContext.Provider>
    </div>
  )
}
