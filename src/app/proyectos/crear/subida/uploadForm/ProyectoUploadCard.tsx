"use client"

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid"
import cx from "classnames"
import type { KeyboardEvent } from "react"
import { useState } from "react"

import type { ParticipaType } from "@/participa"
import type { ErrorMessage, ProyectoToUpload, ProyectoType } from "@/proyectos"
import {
  EditProyectoForm,
  mapProyectoToUploadToProyectType,
  mapProyectoTypeToProyectoToUpload,
} from "@/proyectos"

import { ErrorMessageCard } from "./messages/ErrorMessageCard"
import { WarningMessageCard } from "./messages/WarningMessageCard"

interface ProyectoCardToUploadProps {
  proyecto: ProyectoToUpload
  onChangeProyecto: (
    updatedProyecto: ProyectoToUpload,
    previousCodigo: string
  ) => Promise<void>
  onSolveConflict: (
    updatedProyecto: ProyectoToUpload,
    errorMessage: ErrorMessage["message"]
  ) => void
}

export const ProyectoCardToUpload = ({
  proyecto,
  onChangeProyecto,
  onSolveConflict,
}: ProyectoCardToUploadProps) => {
  const [isInfoMessagesCollapsed, setIsInfoMessagesCollapsed] = useState(true)
  const errorNumber = proyecto.messages.errors?.length ?? 0
  const warningNumber = proyecto.messages.warnings?.length ?? 0

  const activeErrors =
    errorNumber && proyecto.messages.errors?.some((error) => !error.read)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") setIsInfoMessagesCollapsed(!isInfoMessagesCollapsed)
  }

  return (
    <article
      aria-label={`Proyecto de código ${proyecto.codigo}`}
      className={cx(
        "flex flex-col relative justify-between border-2 rounded-md min-h-28 transition-shadow",
        {
          "border-primary": !activeErrors,
          "border-error shadow-lg shadow-error": activeErrors,
        }
      )}
    >
      <EditProyectoForm
        proyecto={mapProyectoToUploadToProyectType(proyecto)}
        finishEditMode={() => {}}
        participaciones={proyecto.participantes}
        unSync
        onUpdate={(
          proyectoToUpdate?: ProyectoType,
          participa?: ParticipaType[]
        ): void => {
          if (proyectoToUpdate) {
            onChangeProyecto(
              mapProyectoTypeToProyectoToUpload({
                proyecto: proyectoToUpdate,
                participaciones: participa?.map((participa) => ({
                  ...participa,
                  codigo: proyectoToUpdate.codigo,
                })),
              }),
              proyecto?.codigo ?? ""
            )
          }
        }}
      />

      <div
        onKeyDown={onKeyDown}
        className="flex flex-row bg-highlight-secondary pl-2 border-t w-full border-t-gray-400 rounded-b-md"
        onClick={() => setIsInfoMessagesCollapsed(!isInfoMessagesCollapsed)}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-grow w-full justify-center">
          {errorNumber > 0 && (
            <p
              className="flex flex-row mr-2"
              aria-label={`There are ${errorNumber} errors`}
            >
              {errorNumber}
              <ExclamationCircleIcon className="mt-[2px] h-[20px] w-[20px] text-error bg-secondary rounded-full" />
            </p>
          )}
          {warningNumber > 0 && (
            <p
              className="flex flex-row mr-2"
              aria-label={`There are ${warningNumber} warnings`}
            >
              {warningNumber}
              <ExclamationCircleIcon className="mt-[2px] h-[20px] w-[20px] text-warning bg-secondary rounded-full" />
            </p>
          )}
          <h3>
            {`${errorNumber > 0 ? "Errores" : ""}${errorNumber && warningNumber ? " y " : ""}${warningNumber ? "Avisos" : ""}`}
          </h3>
        </div>
        {isInfoMessagesCollapsed ? (
          <ChevronDownIcon className="mx-2 mt-[2px] h-[20px] w-[20px]" />
        ) : (
          <ChevronUpIcon className="mx-2 mt-[2px] h-[20px] w-[20px]" />
        )}
      </div>
      <ul
        className={cx(
          "flex flex-col gap-4 p-4 bg-highlight-secondary rounded-b-md",
          {
            hidden: isInfoMessagesCollapsed,
            block: !isInfoMessagesCollapsed,
          }
        )}
      >
        {proyecto.messages.errors?.map((message) => (
          <li key={`${proyecto.codigo}-${message.message}`}>
            <ErrorMessageCard
              errorMessage={message}
              onDismiss={() => {
                onSolveConflict(proyecto, message.message)
              }}
            />
          </li>
        ))}
        {proyecto.messages.warnings?.map((message) => (
          <li key={`${proyecto.codigo}-${message.message}`}>
            <WarningMessageCard warningMessage={message.message} />
          </li>
        ))}
      </ul>
    </article>
  )
}
