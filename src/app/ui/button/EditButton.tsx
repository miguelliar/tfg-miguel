import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import { PencilIcon as ActivePencilIcon } from "@heroicons/react/24/solid"
import type { Dispatch, KeyboardEventHandler, SetStateAction } from "react"

export const EditButton = ({
  isEditMode,
  setEditMode,
  onKeyDown,
}: {
  isEditMode: boolean
  setEditMode: Dispatch<SetStateAction<boolean>>
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
}) => {
  return isEditMode ? (
    <button
      className="w-6"
      type="button"
      onClick={() => setEditMode(false)}
      onKeyDown={onKeyDown}
    >
      <ActivePencilIcon title="Finalizar de editar proyecto" />
    </button>
  ) : (
    <button
      className="w-6"
      type="button"
      onClick={() => setEditMode(true)}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      onKeyDown={onKeyDown}
    >
      <InactivePencilIcon title="Editar proyecto" />
    </button>
  )
}
