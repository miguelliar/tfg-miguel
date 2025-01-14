"use client"

import {
  fetchAllProyectosByInvestigadores,
  fetchDistinctProyectosByInvestigadores,
  fetchJoinProyectosByInvestigadores,
} from "@/db"

export const MostrarProyectos = ({ fetchSearchedProyectos }: any) => {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() =>
          fetchSearchedProyectos(fetchAllProyectosByInvestigadores)
        }
      >
        Mostrar proyectos en los que participe al menos un investigador
      </button>
      <button
        type="button"
        onClick={() =>
          fetchSearchedProyectos(fetchJoinProyectosByInvestigadores)
        }
      >
        Mostrar proyectos en los que participen todos los investigadores
      </button>
      <button
        type="button"
        onClick={() =>
          fetchSearchedProyectos(fetchDistinctProyectosByInvestigadores)
        }
      >
        Mostrar proyectos en los que no participen en conjunto
      </button>
    </div>
  )
}
