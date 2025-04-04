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
        />
      ) : null}
      <form className="m-7" onSubmit={(e) => onSubmit(e)}>
        <label className="flex flex-col" htmlFor="proyectoFile">
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
      {/* TODO add validation button before submit here */}
      <p>{isLoading ? "Loading" : null}</p>
      <div className="mx-4 mb-4">
        {!isSubmitEnabled &&
          uploadedProyectos &&
          uploadedProyectos.length > 0 && (
            <p>
              Algunos proyectos tienen errores. Antes de subir los proyectos
              revisa los proyectos y corrige los problemas o ignora los errores.
              Aquellos que sean ignorados no se subirán
            </p>
          )}
        {errorMessage && <p className="text-red-900">{errorMessage}</p>}
        {!isLoading && uploadedProyectos && uploadedProyectos.length > 0 ? (
          <div className="grid grid-cols-adaptable_big gap-4">
            {uploadedProyectos.map((proyecto) => (
              <ProyectoCardToUpload
                key={proyecto.codigo}
                proyecto={proyecto}
                onChangeProyecto={onChangeProyecto}
                onSolveConflict={onSolveConflict}
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
