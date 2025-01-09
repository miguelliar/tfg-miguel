"use client"

import type { ProyectoType } from "@/db"

import { ProyectoMiniCard } from "../../cards/proyecto/ProyectoMiniCard"

export const ProyectoGrid = ({ proyectos }: { proyectos?: ProyectoType[] }) => {
  return (
    <div className="grid grid-cols-adaptable gap-4">
      {proyectos &&
        proyectos.map((proyecto) => (
          <ProyectoMiniCard
            key={`ProyectoCard-${proyecto.codigo}`}
            proyecto={proyecto}
          />
        ))}
    </div>
  )
}
