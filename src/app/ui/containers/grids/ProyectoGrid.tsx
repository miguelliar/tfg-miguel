import type { ProyectoType } from "@/app/utils"

import { ProyectoMiniCard } from "../../cards/proyecto/ProyectoMiniCard"

export const ProyectoGrid = async ({
  proyectos,
}: {
  proyectos?: ProyectoType[]
}) => {
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
