"use client"

import cx from "classnames"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "../button/Button"

export const InvestigadoresList = ({
  selectedInvestigadores,
}: {
  selectedInvestigadores: string[]
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const removeInvestigador = (email: string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("selectedEmail", email)
    replace(`${pathname}?${params.toString()}`)
  }

  const removeAll = () => {
    const params = new URLSearchParams(searchParams ?? "")
    params.delete("selectedEmail")
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col mt-4 basis-1/2 flex-grow">
      <h3 className="text-xl">Investigadores seleccionados</h3>
      <section>
        <ul
          className={cx(
            "flex flex-col gap-2 px-3 py-2 my-2 outline-2 border-font-color rounded-md list-disc  min-w-72 max-w-96",
            { border: selectedInvestigadores.length }
          )}
        >
          {selectedInvestigadores.map((investigador) => (
            <li key={investigador} className="flex flex-row gap-4">
              <Button
                variant="fill"
                className="py-0"
                onClick={() => removeInvestigador(investigador)}
              >
                Quitar
              </Button>
              <b className="text-special-color overflow-hidden text-ellipsis">
                {investigador}
              </b>
            </li>
          ))}
        </ul>
        {selectedInvestigadores.length ? (
          <Button variant="fill" onClick={removeAll}>
            Quitar todos
          </Button>
        ) : null}
      </section>
    </div>
  )
}
