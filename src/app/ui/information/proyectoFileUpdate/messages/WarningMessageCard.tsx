import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import ShowMoreText from "react-show-more-text"

export const WarningMessageCard = ({
  codigo,
  warningMessage,
}: {
  codigo: string
  warningMessage: string
}) => {
  return (
    <div className="flex flex-col justify-between border-2 rounded-md min-h-27 border-orange-600 w-full">
      <p className="flex flex-row w-full bg-orange-600 text-background-color p-2 rounded-t-md">
        <ExclamationCircleIcon className="mx-2 mt-[2px] h-[20px] w-[20px] text-orange-600 bg-background-color rounded-full" />
        Aviso en {codigo}
      </p>
      <ShowMoreText
        lines={1}
        className="mx-4 my-1"
        more={
          <button className="text-gray-500 text-sm" type="button">
            Más...
          </button>
        }
        less={
          <button className="text-gray-500 text-sm" type="button">
            ...Menos
          </button>
        }
      >
        <p className="whitespace-pre-line">{warningMessage}</p>
      </ShowMoreText>
      {/* TODO: Add button to solve warnings <Button>Solucionar</Button> */}
    </div>
  )
}
