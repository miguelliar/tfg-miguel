import {
  CreateProyectoButton,
  Pagination,
  ProyectoGrid,
  Search,
} from "@/app/ui"
import {
  fetchProyectoByQuery,
  fetchProyectoData,
  fetchProyectoTotalPages,
} from "@/db"

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
  const proyectos = query
    ? await fetchProyectoByQuery(query, currentPage)
    : await fetchProyectoData(currentPage)

  return (
    <main>
      <h1 className="text-4xl m-5">Proyectos</h1>
      <section className="m-4 p-1 flex flex-col justify-items-center">
        <div className="flex flex-row justify-between">
          <Search />
          <CreateProyectoButton />
        </div>
        <ProyectoGrid proyectos={proyectos ?? []} isDBSync />
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  )
}
