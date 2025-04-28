import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid"

import type { ProyectoFileState } from "@/app/utils"

import { Button } from "../../button/Button"
import { CardModal } from "../../cards/CardModal"

type SubmitStatusInfoProps = {
  submittedStatus: ProyectoFileState["submittedStatus"]
  onCloseSubmitMessage: () => void
  messages: {
    onSuccess: string
    onFailure: string
  }
}

export const SubmitStatusInfo = ({
  submittedStatus,
  onCloseSubmitMessage,
  messages,
}: SubmitStatusInfoProps) => {
  return (
    <CardModal onClose={onCloseSubmitMessage}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row items-center text-lg">
          {submittedStatus === "success" ? (
            <>
              <CheckBadgeIcon className="mx-2 mt-[2px] h-10 w-10 text-success bg-secondary rounded-full" />
              <p>
                <b>Éxito</b>: {messages.onSuccess}
              </p>
            </>
          ) : (
            <>
              <XCircleIcon className="mx-2 mt-[2px] h-10 w-10 text-error-accent bg-secondary rounded-full" />
              <p>
                <b>Error</b>: {messages.onFailure}
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
