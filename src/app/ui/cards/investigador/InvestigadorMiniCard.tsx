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
        <div className="my-1 mx-3 flex justify-center">
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
            onClick={() => appendQueryParam("email", investigador.email)}
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
      </div>
    </div>
  )
}
