import { fetchProyectoByQuery, fetchProyectoData } from "@/db"

import { ProyectoMiniCard } from "../../cards/proyecto/ProyectoMiniCard"

export const ProyectoGrid = async ({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) => {
  const proyectos = query
    ? await fetchProyectoByQuery(query, currentPage)
    : await fetchProyectoData(currentPage)

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
