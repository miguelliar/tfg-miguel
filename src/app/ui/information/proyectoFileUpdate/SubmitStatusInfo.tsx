import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid"

import type { ProyectoFileState } from "@/app/utils"

import { Button } from "../../button/Button"
import { CardModal } from "../../cards/CardModal"

type SubmitStatusInfoProps = {
  submittedStatus: ProyectoFileState["submittedStatus"]
  onCloseSubmitMessage: () => void
}

export const SubmitStatusInfo = ({
  submittedStatus,
  onCloseSubmitMessage,
}: SubmitStatusInfoProps) => {
  return (
    <CardModal onClose={onCloseSubmitMessage}>
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center text-lg">
          {submittedStatus === "success" ? (
            <>
              <CheckBadgeIcon className="mx-2 mt-[2px] h-10 w-10 text-success-color bg-background-color rounded-full" />
              <p>
                Se han subido los archivos con <b>éxito</b>
              </p>
            </>
          ) : (
            <>
              <XCircleIcon className="mx-2 mt-[2px] h-10 w-10 text-error-color-accent bg-background-color rounded-full" />
              <p>
                Ha habido un <b>error</b> al subir los archivos
              </p>
            </>
          )}
        </div>
        <Button className="w-fit" onClick={onCloseSubmitMessage}>
          Cerrar
        </Button>
      </div>
    </CardModal>
  )
}
