import Link from "next/link"

import {
  AddInvestigadorAProyecto,
  InvestigadorTable,
  ProyectoGrid,
} from "@/app/ui"
import { fetchInvestigadoresByProyecto, fetchProyectoData } from "@/db"

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    codigo?: string
  }
}) {
  const projectData = await fetchProyectoData()

  const investigadorData = await fetchInvestigadoresByProyecto(
    searchParams?.codigo ?? ""
  )

  return (
    <main>
      <h1>Proyectos</h1>
      <section>
        <Link href="/proyectos/crear">Añadir proyecto</Link>
      </section>
      <section className="m-4 p-1 flex flex-col">
        <h2 className="text-lg">Selecciona un proyecto</h2>
        <ProyectoGrid proyectos={projectData} />
      </section>
      {searchParams?.codigo && (
        <AddInvestigadorAProyecto codigo={searchParams?.codigo} />
      )}
      <section className="m-4 p-1 flex flex-col">
        <h2 className="text-lg">Investigadores involucrados en el proyecto</h2>
        <InvestigadorTable investigadorData={investigadorData} />
      </section>
    </main>
  )
}
