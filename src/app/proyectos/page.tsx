import Link from "next/link"

import { Pagination, ProyectoGrid, Search } from "@/app/ui"
import { fetchProyectoTotalPages } from "@/db"

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

  return (
    <main>
      <h1>Proyectos</h1>
      <section>
        <Link href="/proyectos/crear">Añadir proyecto</Link>
      </section>
      <section className="m-4 p-1 flex flex-col justify-items-center">
        <Search />
        <ProyectoGrid query={query} currentPage={currentPage} />
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  )
}
