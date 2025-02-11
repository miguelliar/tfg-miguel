"use client"

import cx from "classnames"
import { useState } from "react"

import type { InvestigadorType } from "@/db"

import { InvestigadorCard } from "./InvestigadorCard"

export const InvestigadorMiniCard = ({
  investigador,
}: {
  investigador: InvestigadorType
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={cx("max-h-28")}>
      <div
        className={cx(
          "flex flex-col justify-between border-2 rounded-md min-h-27"
        )}
      >
        <button className="flex-grow" type="button">
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
          className={cx("text-background-color")}
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
