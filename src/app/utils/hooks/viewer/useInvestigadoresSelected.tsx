"use client"

import { useCallback, useState } from "react"

import type { InvestigadorType, SelectInvestigador } from "../../types"

export const useInvestigadoresSelected = (): [
  InvestigadorType[],
  SelectInvestigador,
] => {
  const [selectedInvestigadores, setSelectedInvestigadores] = useState<
    InvestigadorType[]
  >([])

  const selectCallback = useCallback(
    ({
      investigadorSelected,
      selected,
    }: {
      investigadorSelected: InvestigadorType
      selected: boolean
    }) => {
      if (selected) {
        setSelectedInvestigadores([
          ...selectedInvestigadores,
          investigadorSelected,
        ])
      } else {
        setSelectedInvestigadores(
          selectedInvestigadores.filter(
            (investigador) => investigador.email !== investigadorSelected.email
          )
        )
      }

      return selectCallback
    },
    [selectedInvestigadores, setSelectedInvestigadores]
  )

  return [selectedInvestigadores, selectCallback]
}
