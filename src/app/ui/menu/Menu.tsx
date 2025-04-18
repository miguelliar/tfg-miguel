"use client"

import cx from "classnames"
import type { KeyboardEvent } from "react"

type MenuPosition = keyof typeof MENU_POSITION

const MENU_POSITION = {
  top: "bottom-[80%] right-[-375%]",
  bottom: "",
}

export const Menu = ({
  children,
  position = "top",
  onClose,
}: {
  children: React.ReactNode
  position?: MenuPosition
  onClose: () => void
}) => {
  const wrapperOnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation()
      onClose()
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <section
      className={cx(
        "flex flex-col h-fit w-fit absolute overflow-auto bg-secondary px-3 py-6 border rounded-lg border-primary",
        MENU_POSITION[position]
      )}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onKeyDown={wrapperOnKeyDown}
    >
      {children}
    </section>
  )
}
