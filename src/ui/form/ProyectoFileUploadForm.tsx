"use client"

import { ProyectoCardToUpload } from "@/proyectos"

import { Button } from "../button/Button"
import { CardsSkeleton } from "../cards/CardSkeleton"
import { SubmitStatusInfo } from "../information"
import { useProyectoFileUpload } from "./useProyectoFileUpload"

export const ProyectoFileUploaderForm = () => {
  const {
    isSubmitEnabled,
    isLoading,
    uploadedProyectos,
    submittedStatus,
    errorMessage,
    errorPresent,
    onSubmit,
    onChange,
    onChangeProyecto,
    onSolveConflict,
    onCloseSubmitMessage,
  } = useProyectoFileUpload()

  return (
    <>
      {submittedStatus ? (
        <SubmitStatusInfo
          submittedStatus={submittedStatus}
          onCloseSubmitMessage={onCloseSubmitMessage}
          messages={{
            onSuccess: !errorPresent
              ? "Se han subido los proyectos correctamente"
              : "Se han subido los proyectos sin errores correctamente",
            onFailure:
              "No se han subido los proyectos. Ha habido un error en la subida",
          }}
        />
      ) : null}
      <div className="sm:m-7 flex flex-col sm:p-4 gap-8 items-center">
        <label
          className="flex flex-col gap-3 md:gap-4 w-full items-center"
          htmlFor="proyectoFile"
        >
          <span>Elige un archivo .csv con los proyectos a subir</span>
          <input
            type="file"
            id="proyectoFile"
            name="proyectoFile"
            onChange={(event) => onChange(event.target.files?.[0])}
          />
        </label>
        <div className="flex flex-col items-center gap-7 w-full">
          {!isSubmitEnabled &&
            uploadedProyectos &&
            uploadedProyectos.length > 0 && (
              <>
                <h2 className="text-3xl">Proyectos procesados</h2>
                <section className="border border-solid border-error bg-secondary-soft shadow-lg shadow-error p-4 rounded-lg">
                  <h3 className="text-xl text-error-accent mb-4">
                    Algunos proyectos tienen errores.
                  </h3>
                  <p>
                    <span>
                      Antes de subir los proyectos revisa los proyectos y
                      corrige los problemas o ignora los errores.
                    </span>
                    <br />
                    <b>Aquellos que sean ignorados no se añadirán.</b>
                  </p>
                </section>
              </>
            )}
          {errorMessage && <p className="text-error-accent">{errorMessage}</p>}
          <section className="grid grid-cols-adaptable-big-mobile sm:grid-cols-adaptable-big gap-4 w-full">
            {!isLoading && uploadedProyectos && uploadedProyectos.length > 0 ? (
              <>
                {uploadedProyectos.map((proyecto) => (
                  <ProyectoCardToUpload
                    key={proyecto.codigo}
                    proyecto={proyecto}
                    onChangeProyecto={onChangeProyecto}
                    onSolveConflict={onSolveConflict}
                  />
                ))}
              </>
            ) : null}
          </section>
          {isLoading ? <CardsSkeleton /> : null}
        </div>
        <Button
          onClick={onSubmit}
          type="submit"
          variant="fill"
          className="m-4 w-fit"
          disabled={!isSubmitEnabled}
        >
          Enviar
        </Button>
      </div>
    </>
  )
}
