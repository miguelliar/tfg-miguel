"use client"

import cx from "classnames"
import type { KeyboardEvent } from "react"

export const Menu = ({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode
  className?: string
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
        className
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
