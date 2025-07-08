"use client"

import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import cx from "classnames"

import type { ParticipaType } from "@/participa"
import type { ProyectoToUpload, ProyectoType } from "@/proyectos"
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
  onSolveConflict: (updatedProyecto: ProyectoToUpload) => void
}

export const ProyectoCardToUpload = ({
  proyecto,
  onChangeProyecto,
  onSolveConflict,
}: ProyectoCardToUploadProps) => {
  const errorNumber = proyecto.messages.errors?.length ?? 0
  const warningNumber = proyecto.messages.warnings?.length ?? 0

  const activeErrors =
    errorNumber && proyecto.messages.errors?.some((error) => !error.read)

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

      <div className="flex flex-row bg-highlight-secondary pl-2 border-t w-full border-t-gray-400 rounded-b-md">
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
      </div>
      <ul className="flex flex-col gap-4 p-4 bg-highlight-secondary rounded-b-md">
        {proyecto.messages.errors?.map((message) => (
          <li key={`${proyecto.codigo}-${message.message}`}>
            <ErrorMessageCard
              errorMessage={message}
              onDismiss={() => {
                onSolveConflict(proyecto)
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
