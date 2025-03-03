"use client"

import { XMarkIcon } from "@heroicons/react/24/solid"
import type { KeyboardEvent } from "react"
import { useRef } from "react"

import { CloseRefContext } from "@/app/utils"

export const CardModal = ({
  children,
  option,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
  option?: React.ReactNode
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const wrapperOnKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose()
    }
  }
  const closeBtnOnKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab" && !event.shiftKey) {
      onClose()
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="h-full w-full fixed top-0 left-0 bg-slate-600/50 z-10"
      onClick={onClose}
      onKeyDown={wrapperOnKeyDown}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <section
        className="flex flex-col fixed max-h-[90%] overflow-scroll top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-color rounded-lg px-3 py-6 w-[90%] sm:w-[70%] lg:w-fit"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="fixed top-2 right-2">
          {option || null}
          <button
            className="w-6"
            type="button"
            onClick={onClose}
            onKeyDown={closeBtnOnKeyDown}
            ref={closeBtnRef}
          >
            <XMarkIcon title="Cerrar tarjeta de proyecto" />
          </button>
        </div>
        <div className="flex flex-col justify-around mx-8 items-center">
          <CloseRefContext.Provider value={closeBtnRef}>
            {children}
          </CloseRefContext.Provider>
        </div>
      </section>
    </div>
  )
}
