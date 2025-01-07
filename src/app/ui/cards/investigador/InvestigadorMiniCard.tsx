"use client"

import cx from "classnames"
import { useState } from "react"

import type { InvestigadorType } from "@/db"

import { InvestigadorCard } from "./InvestigadorCard"

export const InvestigadorMiniCard = ({
  investigador,
  select,
}: {
  investigador: InvestigadorType
  select: (props: {
    investigadorSelected: InvestigadorType
    selected: boolean
  }) => void
}) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(false)
  const selectInvestigadorOnClick = () => {
    setSelected(!selected)
    select({ investigadorSelected: investigador, selected: !selected })
  }
  const selectInvestigadorLabelText = `${selected ? "Des-seleccionar" : "Seleccionar"} investigador ${investigador.email}`

  return (
    <div className={cx("max-h-28")}>
      <div
        className={cx(
          "flex flex-col justify-between border-2 rounded-md min-h-27",
          { "border-font-color": !selected, "border-special-color": selected }
        )}
      >
        <button
          className="flex-grow"
          type="button"
          onClick={selectInvestigadorOnClick}
          aria-label={selectInvestigadorLabelText}
        >
          <div className="flex flex-row justify-center mt-1 text-special-color">
            <h2 className="text-ellipsis overflow-hidden text-nowrap">
              {investigador.email}
            </h2>
          </div>
          <div className="my-1 mx-3">
            <p className="text-ellipsis overflow-hidden text-nowrap">
              {`${investigador.nombre} ${investigador.apellidos}`}
            </p>
          </div>
        </button>
        <button
          type="button"
          className={cx("text-background-color", {
            "bg-font-color": !selected,
            "bg-special-color": selected,
          })}
          onClick={() => setOpen(!open)}
          aria-label={`Ver detalles de ${investigador.email}`}
        >
          Ver detalles
        </button>
        {open ? (
          <InvestigadorCard
            investigador={investigador}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </div>
    </div>
  )
}
