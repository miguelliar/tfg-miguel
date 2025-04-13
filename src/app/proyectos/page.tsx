import {
  CreateProyectoButton,
  Pagination,
  ProyectoCard,
  ProyectoMiniCard,
  Search,
} from "@/app/ui"
import { fetchProyectoByCode, fetchProyectoTotalPages } from "@/db"

import { fetchProyectosMinimumData } from "../utils"

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
    codigo?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const codigo = searchParams?.codigo || ""

  const currentProyecto = codigo ? await fetchProyectoByCode(codigo) : null
  const totalPages = await fetchProyectoTotalPages(query)
  const proyectosMinimumData = await fetchProyectosMinimumData(
    query,
    currentPage
  )

  return (
    <>
      <h1 className="text-4xl m-5">Proyectos</h1>
      <section className="m-4 p-1 flex flex-col justify-items-center">
        {currentProyecto && <ProyectoCard proyecto={currentProyecto} />}
        <div className="flex flex-col md:flex-row justify-between">
          <Search />
          <div className="flex m-5 mt-1 justify-center">
            <CreateProyectoButton />
          </div>
        </div>
        <div className="grid grid-cols-adaptable gap-4">
          {proyectosMinimumData &&
            proyectosMinimumData.map((proyecto) => (
              <ProyectoMiniCard
                key={`ProyectoCard-${proyecto.codigo}`}
                proyecto={proyecto}
              />
            ))}
        </div>
        <Pagination totalPages={totalPages} />
      </section>
    </>
  )
}
