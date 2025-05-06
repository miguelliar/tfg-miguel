"use client"

import cx from "classnames"
import { useContext, useMemo } from "react"

import type { InvestigadorMinimumDataType } from "@/app/utils"
import { SearchProyectoByInvestigadorContext } from "@/app/utils"
import { useQueryParam } from "@/app/utils/hooks/useQueryParam"

import { Button } from "../../button/Button"

export const InvestigadorMiniCard = ({
  investigador,
}: {
  investigador: InvestigadorMinimumDataType
}) => {
  const { appendQueryParam, hasQueryParam, removeQueryParam } = useQueryParam()

  const { isSearchProyectosByInvestigadorActive: isSelectable } = useContext(
    SearchProyectoByInvestigadorContext
  )
  const selected = useMemo(
    () => isSelectable && hasQueryParam("selectedEmail", investigador.email),
    [hasQueryParam, investigador.email, isSelectable]
  )

  const selectInvestigadorOnClick = () => {
    if (selected) removeQueryParam("selectedEmail", investigador.email)
    else appendQueryParam("selectedEmail", investigador.email)
  }

  const selectInvestigadorLabelText = `${selected ? "Deseleccionar" : "Seleccionar"} investigador ${investigador.email}`
  const buttonStyle = cx("p-2 text-secondary", {
    "bg-primary hover:bg-primary-strong focus:bg-primary-strong": !selected,
    "bg-accent-primary hover:bg-accent-primary-strong focus:bg-accent-primary-strong":
      selected,
  })

  return (
    <section className={cx("max-h-28")}>
      <div
        className={cx(
          "flex flex-col justify-between border-2 rounded-md min-h-27",
          { "border-primary": !selected, "border-accent-primary": selected }
        )}
      >
        <div className="flex flex-row flex-grow justify-center mt-1 text-accent-primary">
          <h2 className="text-ellipsis overflow-hidden text-nowrap">
            {investigador.email}
          </h2>
        </div>
        <div className="my-1 mx-3 flex justify-center">
          <p className="text-ellipsis overflow-hidden text-nowrap">
            {`${investigador.nombre} ${investigador.apellidos}`}
          </p>
        </div>
        <div className="flex flex-row my-1 w-full flex-grow justify-around">
          <Button
            className={buttonStyle}
            onClick={() => appendQueryParam("email", investigador.email)}
            aria-label={`Ver detalles de ${investigador.email}`}
            variant="custom"
          >
            Ver detalles
          </Button>
          {isSelectable ? (
            <Button
              className={buttonStyle}
              aria-label={selectInvestigadorLabelText}
              onClick={selectInvestigadorOnClick}
              variant="custom"
            >
              {selected ? "Deseleccionar" : "Seleccionar"}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
