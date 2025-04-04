import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import { PencilIcon as ActivePencilIcon } from "@heroicons/react/24/solid"
import cx from "classnames"
import type { Dispatch, KeyboardEventHandler, SetStateAction } from "react"

export const EditButton = ({
  className,
  isEditMode,
  setEditMode,
  onKeyDown,
}: {
  isEditMode: boolean
  setEditMode: Dispatch<SetStateAction<boolean>>
  className?: string
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
}) => {
  return (
    <button
      className={cx("w-6", className)}
      type="button"
      onClick={() => setEditMode(!isEditMode)}
      onKeyDown={onKeyDown}
    >
      {isEditMode ? (
        <ActivePencilIcon title="Finalizar de editar proyecto" />
      ) : (
        <InactivePencilIcon title="Editar proyecto" />
      )}
    </button>
  )
}
