import { type InfoMessage, InfoMessageType } from "../utils"

const ErrorMessageCard = ({
  codigo,
  errorMessage,
}: {
  codigo: string
  errorMessage: string
}) => {
  return (
    <li className="max-h-28">
      <div className="flex flex-col justify-between p-2 border-2 rounded-md min-h-27 border-red-500">
        <p>Error en {codigo}</p>
        <p>{errorMessage}</p>
      </div>
    </li>
  )
}

const WarningMessageCard = ({
  codigo,
  warningMessage,
}: {
  codigo: string
  warningMessage: string
}) => {
  return (
    <li className="max-h-28">
      <div className="flex flex-col justify-between p-2 border-2 rounded-md min-h-27 border-orange-300">
        <p>Aviso en {codigo}</p>
        <p>{warningMessage}</p>
      </div>
    </li>
  )
}

export const InformationMessage = ({
  informationMessage,
}: {
  informationMessage: InfoMessage[]
}) => {
  return typeof informationMessage === "string" ? (
    <div>{informationMessage}</div>
  ) : (
    <ul className="grid grid-cols-adaptable gap-4">
      {informationMessage.map((message) => (
        <li key={`${message.codigo}-${message.message}`}>
          {message.type === InfoMessageType.ERROR && message.codigo && (
            <ErrorMessageCard
              codigo={message.codigo}
              errorMessage={message.message}
            />
          )}
          {message.type === InfoMessageType.WARNING && message.codigo && (
            <WarningMessageCard
              codigo={message.codigo}
              warningMessage={message.message}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
