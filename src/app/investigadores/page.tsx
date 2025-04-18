import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

import {
  fetchInvestigadorByEmail,
  fetchInvestigadorData,
  fetchInvestigadoresByQuery,
  fetchInvestigadorTotalPages,
} from "@/db"

import {
  InvestigadorCard,
  InvestigadorMiniCard,
  Pagination,
  ProyectoViewerByInvestigador,
  Search,
  SearchProyectosByInvestigadorButton,
} from "../ui"

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
    email?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const email = searchParams?.email || ""

  const currentInvestigador = email
    ? await fetchInvestigadorByEmail(email)
    : null
  const totalPages = await fetchInvestigadorTotalPages(query)

  const investigadores = query
    ? await fetchInvestigadoresByQuery(query, currentPage)
    : await fetchInvestigadorData(currentPage)

  return (
    <>
      <h1 className="text-4xl m-5">Investigadores</h1>
      <section className="m-4 p-1 flex flex-col">
        {currentInvestigador && (
          <InvestigadorCard investigador={currentInvestigador} />
        )}
        <ProyectoViewerByInvestigador>
          <div className="flex flex-col md:flex-row justify-between">
            <Search />
            <div className="flex flex-col sm:flex-row mb-5 mt-1 gap-2 sm:gap-x-2 justify-center items-center">
              <Link
                href="investigadores/crear"
                className="flex flex-row text-nowrap max-h-fit max-w-fit rounded-md border p-2 border-primary outline-2 text-primary bg-secondary"
              >
                Añadir Investigador
                <PlusIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
              </Link>
              <SearchProyectosByInvestigadorButton />
            </div>
          </div>
          {investigadores ? (
            <div className="grid grid-cols-adaptable gap-4">
              {investigadores &&
                investigadores.map((investigador) => (
                  <InvestigadorMiniCard
                    key={`ProyectoCard-${investigador.email}`}
                    investigador={investigador}
                  />
                ))}
            </div>
          ) : null}
          <Pagination totalPages={totalPages} />
        </ProyectoViewerByInvestigador>
      </section>
    </>
  )
}
