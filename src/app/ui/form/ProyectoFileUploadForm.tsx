"use client"

import { Button } from "../button/Button"
import { ProyectoCard, ProyectoMiniCard } from "../cards"
import { InformationMessage, SubmitStatusInfo } from "../information"
import { useProyectoFileUpload } from "./useProyectoFileUpload"

export const ProyectoFileUploaderForm = () => {
  const {
    isValidateEnabled,
    isSubmitEnabled,
    isLoading,
    informationMessages,
    uploadedProyecto,
    submittedStatus,
    proyectoDetails,
    onSubmit,
    onChange,
    onValidate,
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
            type="button"
            variant="fill"
            className="m-4"
            onClick={onValidate}
            disabled={!isValidateEnabled}
          >
            Validar
          </Button>
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
        {informationMessages && informationMessages.length > 0 ? (
          <InformationMessage informationMessage={informationMessages} />
        ) : null}
        {!isLoading && uploadedProyecto && uploadedProyecto.length > 0 ? (
          <div className="grid grid-cols-adaptable gap-4">
            {uploadedProyecto.map((proyecto) => (
              <ProyectoMiniCard key={proyecto.codigo} proyecto={proyecto} />
            ))}
          </div>
        ) : null}
      </div>
      {proyectoDetails && <ProyectoCard unSync proyecto={proyectoDetails} />}
    </>
  )
}
