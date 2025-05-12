import { PencilIcon as InactivePencilIcon } from "@heroicons/react/24/outline"
import { PencilIcon as ActivePencilIcon } from "@heroicons/react/24/solid"
import cx from "classnames"
import type { Dispatch, SetStateAction } from "react"

import { Button } from "./Button"

export const EditButton = ({
  className,
  isEditMode,
  setEditMode,
}: {
  isEditMode: boolean
  setEditMode: Dispatch<SetStateAction<boolean>>
  className?: string
}) => {
  const title = isEditMode ? "Finalizar de editar proyecto" : "Editar proyecto"
  return (
    <Button
      className={cx("w-6", className)}
      variant="minimal"
      onClick={() => setEditMode(!isEditMode)}
      ariaLabel={title}
      autoFocus
    >
      {isEditMode ? <ActivePencilIcon /> : <InactivePencilIcon />}
    </Button>
  )
}
