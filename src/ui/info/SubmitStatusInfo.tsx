import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid"

import type { ProyectoFileState } from "@/utils"

import { Button } from "../button/Button"
// This is a deep import to avoid a dependency cycles
import { CardModal } from "../cards/CardModal"

type SubmitStatusInfoProps = {
  submittedStatus: ProyectoFileState["submittedStatus"]
  onCloseSubmitMessage: () => void
  messages: {
    onSuccess?: string
    onFailure?: string
  }
}

export const SubmitStatusInfo = ({
  submittedStatus,
  onCloseSubmitMessage,
  messages,
}: SubmitStatusInfoProps) => {
  return (
    <CardModal onClose={onCloseSubmitMessage}>
      <div className="flex flex-col items-center gap-4 w-fit">
        <div className="flex flex-col items-center text-lg">
          {submittedStatus === "success" ? (
            <>
              <div className="flex flex-row items-center">
                <CheckBadgeIcon className="mx-2 mt-[2px] h-[40px] w-[40px] text-success bg-secondary rounded-full" />
                <p>
                  <strong>Éxito</strong>
                </p>
              </div>
              <p className="text-center">{messages.onSuccess ?? null}</p>
            </>
          ) : (
            <>
              <div className="flex flex-row items-center">
                <XCircleIcon className="mx-2 mt-[2px] h-[40px] w-[40px] text-error-accent bg-secondary rounded-full" />
                <p>
                  <strong>Error</strong>
                </p>
              </div>
              <p className="text-center">{messages.onFailure ?? null}</p>
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
