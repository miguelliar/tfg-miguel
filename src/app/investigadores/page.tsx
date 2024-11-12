import Link from "next/link"

import { InvestigadorTable } from "@/app/ui"
import { fetchInvestigadorData } from "@/db"

export default async function Page() {
  const investigadorData = await fetchInvestigadorData()

  return (
    <main>
      <h1>Investigadores</h1>
      <section>
        <Link href="/investigadores/crear">Crear investigador</Link>
      </section>
      <section className="m-4 p-1 flex flex-col">
        <InvestigadorTable investigadorData={investigadorData} />
      </section>
    </main>
  )
}
