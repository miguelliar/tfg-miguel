import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid"

import { Button } from "@/ui/button"
import { CardModal } from "@/ui/cards"
import type { ProyectoFileState } from "@/utils"

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
      <div className="flex flex-col items-center gap-4 w-fit">
        <div className="flex flex-col items-center text-lg">
          {submittedStatus === "success" ? (
            <>
              <div className="flex flex-row items-center">
                <CheckBadgeIcon className="mx-2 mt-[2px] h-[40px] w-[40px] text-success bg-secondary rounded-full" />
                <p>
                  <b>Éxito</b>
                </p>
              </div>
              <p className="text-center">{messages.onSuccess}</p>
            </>
          ) : (
            <>
              <div className="flex flex-row items-center">
                <XCircleIcon className="mx-2 mt-[2px] h-[40px] w-[40px] text-error-accent bg-secondary rounded-full" />
                <p>
                  <b>Error</b>
                </p>
              </div>
              <p className="text-center">{messages.onFailure}</p>
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
