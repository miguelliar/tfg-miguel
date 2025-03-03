import { ProyectoFileUploaderForm } from "../../form/ProyectoFileUploadForm"
import { CardModal } from "../CardModal"

export const ProyectoSubmitCard = ({ onClose }: { onClose: () => void }) => {
  return (
    <CardModal onClose={onClose}>
      <h2 className="text-2xl text-special-color">
        Añadir Proyectos por archivo
      </h2>
      <ProyectoFileUploaderForm />
    </CardModal>
  )
}
