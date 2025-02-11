"use client"

import type { InvestigadorType } from "@/db"

import { InvestigadorMiniCard } from "../../cards/investigador/InvestigadorMiniCard"

export const InvestigadorGrid = ({
  investigadores,
}: {
  investigadores?: InvestigadorType[]
}) => {
  return (
    <div className="grid grid-cols-adaptable gap-4">
      {investigadores &&
        investigadores.map((investigador) => (
          <InvestigadorMiniCard
            key={`ProyectoCard-${investigador.email}`}
            investigador={investigador}
          />
        ))}
    </div>
  )
}
