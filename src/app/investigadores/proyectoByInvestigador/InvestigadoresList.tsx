"use client"

import cx from "classnames"

import { Button } from "@/ui"
import { useQueryParam } from "@/utils"

export const InvestigadoresList = ({
  selectedInvestigadores,
}: {
  selectedInvestigadores: string[]
}) => {
  const { removeQueryParam } = useQueryParam()

  return (
    <div className="flex flex-col mt-4 basis-1/2 flex-grow">
      <h3 className="text-xl">Investigadores seleccionados</h3>
      <section>
        <ul
          className={cx(
            "flex flex-col gap-2 px-3 py-2 my-2 outline-2 border-primary rounded-md list-disc  min-w-72 max-w-96",
            { border: selectedInvestigadores.length }
          )}
        >
          {selectedInvestigadores.map((investigador) => (
            <li key={investigador} className="flex flex-row gap-4">
              <Button
                ariaLabel={`Quitar al investigador ${investigador}`}
                variant="fill"
                className="py-0"
                onClick={() => removeQueryParam("selectedEmail", investigador)}
              >
                Quitar
              </Button>
              <b className="text-accent-primary overflow-hidden text-ellipsis">
                {investigador}
              </b>
            </li>
          ))}
        </ul>
        {selectedInvestigadores.length ? (
          <Button
            variant="fill"
            onClick={() => removeQueryParam("selectedEmail")}
          >
            Quitar todos
          </Button>
        ) : null}
      </section>
    </div>
  )
}
