import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"
import type { DebouncedState } from "use-debounce"
import { useDebouncedCallback } from "use-debounce"

import {
  fetchInvestigadoresByQuery,
  fetchInvestigadoresNotParticipatingInProject,
  fetchNombresDeAutor,
} from "@/db"
import type { InvestigadorMinimumDataType } from "@/investigadores"

import type { ParticipaType } from "../type"

export type UseAddParticipanteReturn = {
  handleSearch: DebouncedState<(term: string) => void>
  investigadoresSearched: InvestigadorMinimumDataType[]
  investigadorSelected: InvestigadorMinimumDataType | null
  isOtherSelected: boolean
  nombreDeAutor: string
  nombresAutorForSelected: string[]
  query: string
  setInvestigadorSelected: Dispatch<
    SetStateAction<InvestigadorMinimumDataType | null>
  >
  setNombreDeAutor: Dispatch<SetStateAction<string>>
  setIsOtherSelected: Dispatch<SetStateAction<boolean>>
}

const checkInvestigadorNotAdded = (
  investigador: InvestigadorMinimumDataType,
  participaAdded: ParticipaType[]
) => !participaAdded.some((participa) => participa.email === investigador.email)

export const useAddParticipante = ({
  codigo,
  participaAdded,
}: {
  codigo: string
  participaAdded?: ParticipaType[]
}): UseAddParticipanteReturn => {
  // TODO: use reducer for this hook
  // query searched for investigador
  const [query, setQuery] = useState("")
  const [nombreDeAutor, setNombreDeAutor] = useState("")
  const [investigadoresSearched, setInvesigadoresSearched] = useState<
    InvestigadorMinimumDataType[]
  >([])
  const [investigadorSelected, setInvestigadorSelected] =
    useState<InvestigadorMinimumDataType | null>(null)
  const [nombresAutorForSelected, setNombresAutorForSelected] = useState<
    string[]
  >([])
  const [isOtherSelected, setIsOtherSelected] = useState(false)

  // searches for investigadores depending on the query searched
  useEffect(() => {
    if (query && codigo)
      fetchInvestigadoresNotParticipatingInProject(query, codigo)
        .then((investigadores) => {
          if (investigadores && participaAdded && participaAdded.length > 0) {
            setInvesigadoresSearched(
              investigadores.filter((investigador) =>
                checkInvestigadorNotAdded(investigador, participaAdded)
              )
            )
          } else {
            setInvesigadoresSearched(investigadores ?? [])
          }
        })
        .catch(() => setInvesigadoresSearched([]))
    else if (query)
      fetchInvestigadoresByQuery(query)
        .then((investigadores) => {
          if (investigadores && participaAdded && participaAdded.length > 0) {
            setInvesigadoresSearched(
              investigadores.filter((investigador) =>
                checkInvestigadorNotAdded(investigador, participaAdded)
              )
            )
          } else {
            setInvesigadoresSearched(investigadores ?? [])
          }
        })
        .catch(() => setInvesigadoresSearched([]))
    else setInvesigadoresSearched([])
  }, [codigo, participaAdded, query, setInvesigadoresSearched])

  const handleSearch = useDebouncedCallback(
    (term: string) => setQuery(term),
    500
  )

  // searches for nombresDeAutor for investigador selected
  useEffect(() => {
    if (investigadorSelected)
      fetchNombresDeAutor(investigadorSelected.email)
        .then((nombresAutor) => setNombresAutorForSelected(nombresAutor))
        .catch(() => setNombresAutorForSelected([] as string[]))
    else setNombresAutorForSelected([])
  }, [investigadorSelected, setNombresAutorForSelected])

  return {
    handleSearch,
    investigadoresSearched,
    investigadorSelected,
    isOtherSelected,
    nombreDeAutor,
    nombresAutorForSelected,
    query,
    setInvestigadorSelected,
    setNombreDeAutor,
    setIsOtherSelected,
  }
}
