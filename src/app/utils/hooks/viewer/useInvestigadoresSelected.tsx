"use client"

import { useCallback, useState } from "react"

import type { SelectInvestigador } from "../../context"
import type { InvestigadorType } from "../../types"

export const useInvestigadoresSelected = (): [
  InvestigadorType[],
  SelectInvestigador,
  () => void,
] => {
  const [selectedInvestigadores, setSelectedInvestigadores] = useState<
    InvestigadorType[]
  >([])

  const selectCallback = useCallback<SelectInvestigador>(
    ({ investigadorSelected }: { investigadorSelected: InvestigadorType }) => {
      if (
        !selectedInvestigadores.some(
          (investigador) => investigador.email === investigadorSelected.email
        )
      ) {
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

  const clearAllSelected = () => {
    setSelectedInvestigadores([])
  }

  return [selectedInvestigadores, selectCallback, clearAllSelected]
}
