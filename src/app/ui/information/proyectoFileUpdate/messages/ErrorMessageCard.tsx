import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid"
import cx from "classnames"

import { Button } from "@/app/ui/button/Button"
import type { ErrorMessage } from "@/app/utils"

export const ErrorMessageCard = ({
  errorMessage,
  onDismiss,
}: {
  errorMessage: ErrorMessage
  onDismiss: () => void
}) => {
  return (
    <div className="flex flex-col justify-between border-2 rounded-md min-h-27 border-red-700 bg-highlight-background-color">
      <p className="flex flex-row w-full bg-red-700 text-background-color p-2 rounded-t-sm">
        <ExclamationCircleIcon className="mx-2 mt-[2px] h-[20px] w-[20px] text-red-700 bg-highlight-background-color rounded-full" />
        Error
      </p>
      <div className="flex flex-row justify-around items-center">
        <p>{errorMessage.message}</p>
        <Button
          disabled={errorMessage.read}
          ariaLabel="Descartar proyecto"
          variant="fill"
          className={cx("rounded-3xl m-2", {
            "bg-gray-500": errorMessage.read,
          })}
          onClick={onDismiss}
        >
          <CheckIcon className="h-[20px] w-[20px]" />
        </Button>
      </div>
    </div>
  )
}
