"use client"

import {
  ArrowTopRightOnSquareIcon,
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
import { EditButton, HorizontalCard } from "@/ui"

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

const ProyectoInfo = ({ proyecto }: { proyecto: ProyectoToUpload }) => {
  const { participantes } = proyecto
  return (
    <div className="flex flex-col text-center pt-3 px-[14px] sm:px-7 pb-2">
      <h2 className="text-accent-primary">{proyecto.codigo}</h2>
      <div className="flex flex-col gap-2 ">
        <div>
          <h3 className="text-wrap">
            <strong>Investigador Principal: </strong>
          </h3>
          <p className="text-nowrap">{proyecto.ip}</p>
        </div>
        {proyecto.coip && (
          <div className="mt-1">
            <h3>
              <strong>Co Investigador Principal:</strong>
            </h3>
            <p>{proyecto.coip}</p>
          </div>
        )}
        <div className="w-full">
          <h3 className="align-middle">
            <strong>Descripcion</strong>
          </h3>
          <p>{proyecto.titulo}</p>
        </div>
        <div>
          <strong>Financiado:</strong>
          <p>{proyecto.financiado}</p>
        </div>
        <div className="flex flex-row justify-around">
          <div>
            <h3>
              <strong>Inicio:</strong>
            </h3>
            <p suppressHydrationWarning>{proyecto.inicio}</p>
          </div>
          <div>
            <h3>
              <strong>Fin:</strong>
            </h3>
            <p suppressHydrationWarning>{proyecto.fin ?? "Sin fin"}</p>
          </div>
        </div>
        {participantes.length > 0 && (
          <>
            <h3>
              <strong className="mt-5">Participantes</strong>
            </h3>
            <div className="flex flex-col overflow-auto gap-2">
              {participantes.map((participa) => {
                const emailDirection = new URLSearchParams([
                  ["email", participa.email],
                ])

                return (
                  <HorizontalCard
                    key={participa.email}
                    id={participa.email}
                    content={participa.nombreAutor}
                  >
                    <a
                      className="text-secondary bg-primary flex flex-row text-nowrap max-h-fit rounded-md border p-2 border-primary outline-2 hover:text-secondary-soft hover:bg-primary-strong"
                      href={`/investigadores?${emailDirection.toString()}`}
                      target="_blank"
                    >
                      Ver
                      <ArrowTopRightOnSquareIcon className="ml-2 mt-[2px] h-[20px] w-[20px]" />
                    </a>
                  </HorizontalCard>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export const ProyectoCardToUpload = ({
  proyecto,
  onChangeProyecto,
  onSolveConflict,
}: ProyectoCardToUploadProps) => {
  const [isEditMode, setEditMode] = useState(false)
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
      {isEditMode ? (
        <EditProyectoForm
          proyecto={mapProyectoToUploadToProyectType(proyecto)}
          finishEditMode={() => setEditMode(!isEditMode)}
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
                  participaciones: participa,
                }),
                proyecto?.codigo ?? ""
              ).then(() => setEditMode(!isEditMode))
            }
          }}
        />
      ) : (
        <ProyectoInfo proyecto={proyecto} />
      )}
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
      <EditButton
        className="absolute top-1 right-1"
        isEditMode={isEditMode}
        setEditMode={setEditMode}
      />
    </article>
  )
}
