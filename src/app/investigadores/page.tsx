import Link from "next/link"

import { fetchInvestigadorData } from "@/db"

import { InvestigadorGrid } from "../ui"

export default async function Page() {
  const investigadorData = await fetchInvestigadorData()

  return (
    <main>
      <h1 className="text-4xl ml-5">Investigadores</h1>
      <section>
        <Link href="/investigadores/crear">Crear investigador</Link>
      </section>
      <section className="m-4 p-1 flex flex-col">
        <InvestigadorGrid investigadores={investigadorData} />
      </section>
    </main>
  )
}
