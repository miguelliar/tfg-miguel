"use client"

import { Button } from "../button/Button"
// eslint-disable-next-line import/no-cycle
import { ProyectoCardToUpload } from "../cards/proyecto/ProyectoUploadCard"
import { SubmitStatusInfo } from "../information"
import { useProyectoFileUpload } from "./useProyectoFileUpload"

export const ProyectoFileUploaderForm = () => {
  const {
    isSubmitEnabled,
    isLoading,
    uploadedProyectos,
    submittedStatus,
    errorMessage,
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
            onSuccess: "Se han subido los archivos",
            onFailure: "No se han subido los archivos",
          }}
        />
      ) : null}
      <form className="m-7" onSubmit={(e) => onSubmit(e)}>
        <label
          className="flex flex-col md:flex-row gap-3 md:gap-6 w-full"
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
        <div className="flex flex-row">
          <Button
            type="submit"
            variant="fill"
            className="m-4"
            disabled={!isSubmitEnabled}
          >
            Enviar
          </Button>
        </div>
      </form>
      <p>{isLoading ? "Loading" : null}</p>
      <div className="mx-4 mb-4 flex flex-col items-center gap-7">
        {!isSubmitEnabled &&
          uploadedProyectos &&
          uploadedProyectos.length > 0 && (
            <>
              <h2 className="text-3xl">Proyectos procesados</h2>
              <section className="border border-solid border-font-color bg-highlight-background-color p-4 rounded-lg">
                <h3 className="text-xl text-error-color-accent mb-4">
                  Algunos proyectos tienen errores.
                </h3>
                <p>
                  <span>
                    Antes de subir los proyectos revisa los proyectos y corrige
                    los problemas o ignora los errores.
                  </span>
                  <br />
                  <b>Aquellos que sean ignorados no se añadirán.</b>
                </p>
              </section>
            </>
          )}
        {errorMessage && (
          <p className="text-error-color-accent">{errorMessage}</p>
        )}
        {!isLoading && uploadedProyectos && uploadedProyectos.length > 0 ? (
          <section className="grid grid-cols-adaptable_big gap-4">
            {uploadedProyectos.map((proyecto) => (
              <ProyectoCardToUpload
                key={proyecto.codigo}
                proyecto={proyecto}
                onChangeProyecto={onChangeProyecto}
                onSolveConflict={onSolveConflict}
              />
            ))}
          </section>
        ) : null}
      </div>
    </>
  )
}
