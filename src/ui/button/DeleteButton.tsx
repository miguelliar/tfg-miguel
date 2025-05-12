"use client"

import { TrashIcon } from "@heroicons/react/24/solid"
import cx from "classnames"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

import { CardModal } from "../cards/CardModal"
import { SubmitStatusInfo } from "../information"
import { Button } from "./Button"

export const DeleteButton = ({
  title,
  deleteEvent,
  warningMessage,
  submitMessages,
  className,
}: {
  deleteEvent: () => Promise<boolean | undefined>
  title: string
  warningMessage: string
  submitMessages: {
    onSuccess: string
    onFailure: string
  }
  className?: string
}) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessfulDelete, setIsSuccessfulDelete] = useState<boolean | null>(
    null
  )
  const pathname = usePathname()
  const { replace, refresh } = useRouter()

  const onDelete = () => {
    setIsLoading(true)
    deleteEvent().then((isComplete) => {
      setIsSuccessfulDelete(Boolean(isComplete))
      setIsLoading(false)
    })
  }

  return (
    <>
      <Button
        className={cx("w-6", className)}
        variant="minimal"
        onClick={() => setIsWarningOpen(!isWarningOpen)}
        ariaLabel={title}
      >
        <TrashIcon className="w-6 h-6" />
      </Button>
      {isWarningOpen && (
        <CardModal onClose={() => setIsWarningOpen(!isWarningOpen)}>
          <>
            {!isLoading && isSuccessfulDelete === null && (
              <article className="flex flex-col items-center">
                <h2 className="text-xl text-error-accent text-center">
                  {warningMessage}
                </h2>
                <p className="mt-2 text-center">
                  ¿Deseas continuar? Esta acción <b>no es reversible.</b>
                </p>
                <div className="mt-4 flex flex-row gap-4">
                  <Button
                    variant="fill"
                    onClick={() => setIsWarningOpen(!isWarningOpen)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="custom"
                    className="p-2 bg-error text-secondary hover:bg-error-accent focus:bg-error-accent"
                    onClick={onDelete}
                  >
                    Borrar
                  </Button>
                </div>
              </article>
            )}
            {isLoading && !isSuccessfulDelete && (
              <div>
                <p>Cargando...</p>
              </div>
            )}
          </>
        </CardModal>
      )}
      {!isLoading && isSuccessfulDelete !== null && (
        <SubmitStatusInfo
          submittedStatus={isSuccessfulDelete ? "success" : "error"}
          onCloseSubmitMessage={() => {
            replace(pathname ?? "/")
            refresh()
          }}
          messages={submitMessages}
        />
      )}
    </>
  )
}
