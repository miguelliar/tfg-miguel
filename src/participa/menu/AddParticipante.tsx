import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import cx from "classnames"

import { Button, HorizontalCard, Menu, SearchInput } from "@/ui"

import type { ParticipaType } from "../type"
import { useAddParticipante } from "./useAddParticipante"

interface AddParticipanteCardProps {
  codigo: string
  onAdd: (participa: Omit<ParticipaType, "codigo">) => void
  onClose: () => void
  participaAdded?: ParticipaType[]
}

export const AddParticipanteCard = ({
  codigo,
  onAdd,
  onClose,
  participaAdded,
}: AddParticipanteCardProps) => {
  const {
    handleSearch,
    handleNombreAutorInput,
    investigadoresSearched,
    investigadorSelected,
    isOtherSelected,
    nombreDeAutor,
    nombresAutorForSelected,
    query,
    setInvestigadorSelected,
    setNombreDeAutor,
    setIsOtherSelected,
  } = useAddParticipante({ codigo, participaAdded })

  return (
    <Menu
      onClose={onClose}
      className={cx("bottom-full", {
        "right-[-100px]": investigadoresSearched.length > 0,
        "right-[-58px]": investigadoresSearched.length === 0,
      })}
    >
      <div className="w-full">
        <h3>Buscar investigador</h3>
        <div className="relative flex justify-center m-1">
          {
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label htmlFor="search" className="min-w-64">
              <p className="sr-only">Búsqueda</p>
              <SearchInput
                placeholder="Nombre, email..."
                onChange={(e) => {
                  handleSearch(e.target.value)
                }}
                id="search"
              />
            </label>
          }
          <MagnifyingGlassIcon className="relative -left-9 h-[18px] w-[18px] translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
        {!investigadorSelected && (
          <div className="flex flex-col gap-2 max-h-[204px] overflow-auto mt-2 items-center">
            {investigadoresSearched.length > 0 &&
              investigadoresSearched.map((investigador) => (
                <div
                  key={`row-${investigador.email}`}
                  className="flex flex-row gap-2 w-full"
                >
                  <HorizontalCard
                    id={investigador.email}
                    content={`${investigador.nombre} ${investigador.apellidos}`}
                  >
                    <Button
                      ariaLabel={`Seleccionar a ${investigador.nombre} ${investigador.apellidos}`}
                      variant="fill"
                      className="rounded-3xl p-0"
                      onClick={() => setInvestigadorSelected(investigador)}
                    >
                      <p>Seleccionar</p>
                    </Button>
                  </HorizontalCard>
                </div>
              ))}
            {investigadoresSearched.length === 0 &&
              (query ? (
                <p>No hay resultados para {query}</p>
              ) : (
                <p>Busca un investigador</p>
              ))}
          </div>
        )}
        {investigadorSelected && (
          <div className="flex flex-col mt-3">
            <HorizontalCard
              id={investigadorSelected.email}
              content={`${investigadorSelected.nombre} ${investigadorSelected.apellidos}`}
            >
              <Button
                ariaLabel="Deseleccionar como participante"
                variant="fill"
                className="rounded-3xl p-0"
                onClick={() => {
                  setInvestigadorSelected(null)
                  setNombreDeAutor("")
                }}
              >
                <p>Deseleccionar</p>
              </Button>
            </HorizontalCard>
            <div className="flex flex-col my-3">
              <fieldset className="flex flex-col">
                <legend>Seleccionar nombre de autor:</legend>
                {nombresAutorForSelected.length > 0 &&
                  nombresAutorForSelected.map((nombreAutor, index) => {
                    return (
                      <label
                        key={`nombre-autor-option-${nombreAutor}`}
                        htmlFor={nombreAutor}
                      >
                        <input
                          onClick={() => {
                            setNombreDeAutor(nombreAutor)
                            setIsOtherSelected(false)
                          }}
                          id={nombreAutor}
                          name="nombre_autor"
                          value={nombreAutor}
                          type="radio"
                          required
                          defaultChecked={index === 0}
                        />
                        <span className="ml-2">{nombresAutorForSelected}</span>
                      </label>
                    )
                  })}
                <label className="my-2" htmlFor="nombre_autor">
                  <input
                    onClick={() => {
                      setNombreDeAutor("")
                      setIsOtherSelected(true)
                    }}
                    id="nombre_autor"
                    name="nombre_autor"
                    value={nombreDeAutor}
                    type="radio"
                    defaultChecked={nombresAutorForSelected.length === 0}
                  />
                  <span className="ml-2">Introducir manualmente</span>
                </label>
              </fieldset>
              {isOtherSelected && (
                <SearchInput
                  required={isOtherSelected}
                  id="nombre_autor"
                  name="nombre_autor"
                  placeholder="Nombre de autor..."
                  onChange={(e) => handleNombreAutorInput(e.target.value)}
                />
              )}
              <Button
                type="button"
                className="mt-3 flex justify-center"
                disabled={!nombreDeAutor}
                variant="fill"
                onClick={() => {
                  onAdd({
                    email: investigadorSelected?.email,
                    nombreAutor: nombreDeAutor,
                  })
                  onClose()
                }}
              >
                Añadir participante
              </Button>
            </div>
          </div>
        )}
      </div>
    </Menu>
  )
}
