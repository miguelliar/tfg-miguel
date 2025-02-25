import { ProyectoFileUploaderForm } from "../../form/ProyectoFileUploadForm"
import { CardModal } from "../CardModal"

export const ProyectoSubmitCard = ({ onClose }: { onClose: () => void }) => {
  return (
    <CardModal onClose={onClose}>
      <ProyectoFileUploaderForm />
    </CardModal>
  )
}
