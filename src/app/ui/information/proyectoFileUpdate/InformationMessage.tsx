"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid"
import cx from "classnames"
import type { KeyboardEvent } from "react"
import { useState } from "react"

import { type InfoMessage, InfoMessageType } from "../../../utils"
import { ErrorMessageCard } from "./messages/ErrorMessageCard"
import { WarningMessageCard } from "./messages/WarningMessageCard"

export const InformationMessage = ({
  informationMessage,
}: {
  informationMessage: InfoMessage[]
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") setIsCollapsed(!isCollapsed)
  }
  const errorNumber = informationMessage.filter(
    (message) => message.type === InfoMessageType.ERROR
  ).length
  const warningNumber = informationMessage.filter(
    (message) => message.type === InfoMessageType.WARNING
  ).length

  return (
    <div className="border-2 border-gray-600 bg-white rounded-md my-4">
      <div
        onKeyDown={onKeyDown}
        className="mx-4 my-1 flex flex-row"
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        tabIndex={0}
      >
        {warningNumber > 0 && (
          <p
            className="flex flex-row mr-2"
            aria-label={`There are ${warningNumber} warnings`}
          >
            {warningNumber}
            <ExclamationCircleIcon className="mt-[2px] h-[20px] w-[20px] text-orange-600 bg-background-color rounded-full" />
          </p>
        )}
        {errorNumber > 0 && (
          <p
            className="flex flex-row mr-2"
            aria-label={`There are ${errorNumber} errors`}
          >
            {errorNumber}
            <ExclamationCircleIcon className="mt-[2px] h-[20px] w-[20px] text-red-700 bg-background-color rounded-full" />
          </p>
        )}
        <h3>Errores y avisos</h3>
        {isCollapsed ? (
          <ChevronDownIcon className="mx-2 mt-[2px] h-[20px] w-[20px]" />
        ) : (
          <ChevronUpIcon className="mx-2 mt-[2px] h-[20px] w-[20px]" />
        )}
      </div>
      <ul
        className={cx("grid grid-cols-adaptable gap-4 p-4", {
          hidden: isCollapsed,
          block: !isCollapsed,
        })}
      >
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
    </div>
  )
}
