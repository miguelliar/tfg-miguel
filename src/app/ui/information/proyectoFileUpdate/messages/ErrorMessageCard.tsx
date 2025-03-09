import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import ShowMoreText from "react-show-more-text"

export const ErrorMessageCard = ({
  codigo,
  errorMessage,
}: {
  codigo: string
  errorMessage: string
}) => {
  return (
    <div className="flex flex-col justify-between border-2 rounded-md min-h-27 border-red-700">
      <p className="flex flex-row w-full bg-red-700 text-background-color p-2 rounded-t-md">
        <ExclamationCircleIcon className="mx-2 mt-[2px] h-[20px] w-[20px] text-red-700 bg-background-color rounded-full" />
        Error en {codigo}
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
        <p>{errorMessage}</p>
      </ShowMoreText>
    </div>
  )
}
