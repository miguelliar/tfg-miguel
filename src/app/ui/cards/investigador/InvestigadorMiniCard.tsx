"use client"

import cx from "classnames"
import { useContext, useMemo, useState } from "react"

import {
  InvestigadorContext,
  SearchProyectoByInvestigadorContext,
} from "@/app/utils"
import type { InvestigadorType } from "@/db"

import { Button } from "../../button/Button"
import { InvestigadorCard } from "./InvestigadorCard"

export const InvestigadorMiniCard = ({
  investigador,
}: {
  investigador: InvestigadorType
}) => {
  const [open, setOpen] = useState(false)
  const { selectedInvestigadores, select } = useContext(InvestigadorContext)
  const { isSearchProyectosByInvestigadorActive: isSelectable } = useContext(
    SearchProyectoByInvestigadorContext
  )
  const selected = useMemo(
    () =>
      isSelectable &&
      selectedInvestigadores.some(
        (investigadorSelected) =>
          investigadorSelected.email === investigador.email
      ),
    [selectedInvestigadores, investigador, isSelectable]
  )

  const selectInvestigadorOnClick = () => {
    select?.({ investigadorSelected: investigador })
  }

  const selectInvestigadorLabelText = `${selected ? "Deseleccionar" : "Seleccionar"} investigador ${investigador.email}`

  return (
    <div className={cx("max-h-28")}>
      <div
        className={cx(
          "flex flex-col justify-between border-2 rounded-md min-h-27",
          { "border-font-color": !selected, "border-special-color": selected }
        )}
      >
        <div className="flex flex-row flex-grow justify-center mt-1 text-special-color">
          <h2 className="text-ellipsis overflow-hidden text-nowrap">
            {investigador.email}
          </h2>
        </div>
        <div className="my-1 mx-3">
          <p className="text-ellipsis overflow-hidden text-nowrap">
            {`${investigador.nombre} ${investigador.apellidos}`}
          </p>
        </div>
        <div className="flex flex-row my-1 w-full flex-grow justify-around">
          <Button
            className={cx({
              "bg-font-color": !selected,
              "bg-special-color": selected,
            })}
            onClick={() => setOpen(!open)}
            aria-label={`Ver detalles de ${investigador.email}`}
            variant="fill"
          >
            Ver detalles
          </Button>
          {isSelectable ? (
            <Button
              className={cx({
                "bg-special-color": selected,
              })}
              aria-label={selectInvestigadorLabelText}
              onClick={selectInvestigadorOnClick}
              variant="fill"
            >
              {selected ? "Deseleccionar" : "Seleccionar"}
            </Button>
          ) : null}
        </div>
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
