import { ExclamationCircleIcon } from "@heroicons/react/24/solid"

import { Button } from "@/app/ui/button/Button"
import type { ErrorMessage } from "@/proyectos"

export const ErrorMessageCard = ({
  errorMessage,
  onDismiss,
}: {
  errorMessage: ErrorMessage
  onDismiss: () => void
}) => {
  return (
    <div className="flex flex-col justify-between border-2 rounded-md min-h-27 border-error bg-secondary-soft">
      <p className="flex flex-row w-full bg-error text-secondary p-2 rounded-t-sm">
        <ExclamationCircleIcon className="mx-2 mt-[2px] h-[20px] w-[20px] text-error bg-secondary-soft rounded-full" />
        Error
      </p>
      <div className="flex flex-row justify-around items-center p-2 gap-5">
        <p>{errorMessage.message}</p>
        <Button
          disabled={errorMessage.read}
          ariaLabel="Descartar proyecto"
          variant="fill"
          onClick={onDismiss}
        >
          Ignorar
        </Button>
      </div>
    </div>
  )
}
