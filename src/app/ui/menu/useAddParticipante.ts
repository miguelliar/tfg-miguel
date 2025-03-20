import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import type { InvestigadorMinimumDataType } from "@/app/utils"
import {
  fetchInvestigadoresByQuery,
  fetchInvestigadoresNotParticipatingInProject,
  fetchNombresDeAutor,
} from "@/db"

export const useAddParticipante = ({ codigo }: { codigo: string }) => {
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
      fetchInvestigadoresNotParticipatingInProject(query, codigo).then(
        (investigadores) => setInvesigadoresSearched(investigadores ?? [])
      )
    else if (query) fetchInvestigadoresByQuery(query)
    else setInvesigadoresSearched([])
  }, [codigo, query, setInvesigadoresSearched])

  const handleSearch = useDebouncedCallback(
    (term: string) => setQuery(term),
    500
  )

  // searches for nombresDeAutor for investigador selected
  useEffect(() => {
    if (investigadorSelected)
      fetchNombresDeAutor(investigadorSelected.email).then((nombresAutor) =>
        setNombresAutorForSelected(nombresAutor)
      )
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
