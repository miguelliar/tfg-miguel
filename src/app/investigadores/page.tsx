import Link from "next/link"

import {
  fetchInvestigadorData,
  fetchInvestigadoresByQuery,
  fetchInvestigadorTotalPages,
} from "@/db"

import {
  CreateInvestigadorButton,
  InvestigadorGrid,
  Pagination,
  Search,
} from "../ui"
import { ProyectoViewerByInvestigador } from "../ui/viewer/ProyectoViewerByInvestigador"

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchInvestigadorTotalPages(query)

  const investigadores = query
    ? await fetchInvestigadoresByQuery(query, currentPage)
    : await fetchInvestigadorData(currentPage)

  return (
    <main>
      <h1 className="text-4xl m-5">Investigadores</h1>
      <section className="ml-7">
        <Link href="/investigadores/crear">Crear investigador</Link>
      </section>
      <section className="m-4 p-1 flex flex-col">
        <ProyectoViewerByInvestigador>
          <div className="flex flex-row justify-between">
            <Search />
            <CreateInvestigadorButton />
          </div>
          <InvestigadorGrid investigadores={investigadores} />
          <Pagination totalPages={totalPages} />
        </ProyectoViewerByInvestigador>
      </section>
    </main>
  )
}
