import {
  CreateProyectoButton,
  Pagination,
  ProyectoGrid,
  Search,
} from "@/app/ui"
import { fetchProyectoTotalPages } from "@/db"

import { fetchProyectos } from "../utils"

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchProyectoTotalPages(query)
  const proyectos = await fetchProyectos(query, currentPage)

  return (
    <main>
      <h1 className="text-4xl m-5">Proyectos</h1>
      <section className="m-4 p-1 flex flex-col justify-items-center">
        <div className="flex flex-col md:flex-row justify-between">
          <Search />
          <div className="flex m-5 mt-1 justify-center">
            <CreateProyectoButton />
          </div>
        </div>
        <ProyectoGrid proyectos={proyectos ?? []} isDBSync />
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  )
}
