import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import type { ParticipaType } from "@/app/utils"
import {
  fetchInvestigadoresByQuery,
  fetchInvestigadoresNotParticipatingInProject,
  fetchNombresDeAutor,
} from "@/db"
import type { InvestigadorMinimumDataType } from "@/investigadores"

export const useAddParticipante = ({
  codigo,
  participaAdded,
}: {
  codigo: string
  participaAdded?: ParticipaType[]
}) => {
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
        (investigadores) => {
          if (participaAdded && participaAdded.length > 0) {
            setInvesigadoresSearched(
              investigadores?.filter(
                (investigador) =>
                  !participaAdded.some(
                    (participa) => participa.email === investigador.email
                  )
              ) ?? []
            )
          } else {
            setInvesigadoresSearched(investigadores ?? [])
          }
        }
      )
    else if (query) fetchInvestigadoresByQuery(query)
    else setInvesigadoresSearched([])
  }, [codigo, participaAdded, query, setInvesigadoresSearched])

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
