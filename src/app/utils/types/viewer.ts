import type { InvestigadorType } from "./items"

export type SelectInvestigador = (props: {
  investigadorSelected: InvestigadorType
  selected: boolean
}) => void
