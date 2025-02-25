import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import { PencilIcon as ActivePencilIcon } from "@heroicons/react/24/solid"
import type { Dispatch, SetStateAction } from "react"

export const EditButton = ({
  isEditMode,
  setEditMode,
}: {
  isEditMode: boolean
  setEditMode: Dispatch<SetStateAction<boolean>>
}) => {
  return isEditMode ? (
    <button className="w-6" type="button" onClick={() => setEditMode(false)}>
      <ActivePencilIcon title="Finalizar de editar proyecto" />
    </button>
  ) : (
    <button className="w-6" type="button" onClick={() => setEditMode(true)}>
      <InactivePencilIcon title="Editar proyecto" />
    </button>
  )
}
