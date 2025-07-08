import { Button } from "../button/Button"
import { CardModal } from "../cards"

export interface ConfirmCloseEditProps {
  setConfirmCloseEditMode: (state: boolean) => void
  setEditMode: (state: boolean) => void
}

export const ConfirmCloseEdit = ({
  setConfirmCloseEditMode,
  setEditMode,
}: ConfirmCloseEditProps) => {
  return (
    <CardModal onClose={() => setConfirmCloseEditMode(false)}>
      <h2 className="text-3xl my-4">Atención</h2>
      <p className="text-lg my-3">
        Si sales sin guardar se perderán los cambios. ¿Deseas continuar?
      </p>
      <div className="flex flex-row justify-around w-full">
        <Button variant="fill" onClick={() => setConfirmCloseEditMode(false)}>
          Continuar editando
        </Button>
        <Button
          variant="custom"
          className="p-2 text-secondary bg-error hover:bg-error-accent"
          onClick={() => {
            setConfirmCloseEditMode(false)
            setEditMode(false)
          }}
        >
          Salir sin guardar
        </Button>
      </div>
    </CardModal>
  )
}
