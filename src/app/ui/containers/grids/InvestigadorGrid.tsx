"use client"

import type { InvestigadorType } from "@/db"

import { InvestigadorMiniCard } from "../../cards/investigador/InvestigadorMiniCard"
import { useInvestigadorGrid } from "./useInvestigadorGrid"

// Commented lines will be use for future feature
/* const click = (selectedInvestigadores: InvestigadorType[]) => {
  console.log(selectedInvestigadores)
} */

export const InvestigadorGrid = ({
  investigadores,
}: {
  investigadores?: InvestigadorType[]
}) => {
  const [selectedInvestigadores, selectCallback] = useInvestigadorGrid()

  return (
    <>
      {/*
      <div>
        <button type="button" onClick={() => click(selectedInvestigadores)}>
          Mostrar proyectos en comun
        </button>
      </div> */}
      <div className="grid grid-cols-4 gap-4">
        {investigadores &&
          investigadores.map((investigador) => (
            <InvestigadorMiniCard
              key={`ProyectoCard-${investigador.email}`}
              investigador={investigador}
              select={selectCallback}
            />
          ))}
      </div>
      {/** <div>
        <ProjectTable projectData={} />
      </div> */}
    </>
  )
}
