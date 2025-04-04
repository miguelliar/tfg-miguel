import { ExclamationCircleIcon } from "@heroicons/react/24/solid"

export const WarningMessageCard = ({
  warningMessage,
}: {
  warningMessage: string
}) => {
  return (
    <div className="flex flex-col justify-between border-2 rounded-md min-h-27 border-orange-600 bg-highlight-background-color w-full">
      <p className="flex flex-row w-full bg-orange-600 text-background-color p-2 rounded-t-sm">
        <ExclamationCircleIcon className="mx-2 mt-[2px] h-[20px] w-[20px] text-orange-600 bg-highlight-background-color rounded-full" />
        Aviso
      </p>
      <div className="flex justify-around items-center">
        <p className=" mx-4 whitespace-pre-line">{warningMessage}</p>
      </div>
    </div>
  )
}
