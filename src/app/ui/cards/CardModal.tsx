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
      className="max-w-screen-2xl max-h-screen h-full w-full fixed top-0 left-0 bg-slate-600/50 z-10"
      onClick={onClose}
      onKeyDown={wrapperOnKeyDown}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <section
        className="flex flex-col fixed overflow-auto top-0 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-background-color sm:rounded-lg px-3 pt-8 pb-6 w-full sm:w-[70%] lg:w-fit h-full sm:h-fit sm:max-h-screen"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="flex flex-col justify-around md:mx-8 items-center">
          <CloseRefContext.Provider value={closeBtnRef}>
            {children}
          </CloseRefContext.Provider>
        </div>
        <div className="fixed top-2 right-2 flex flex-row">
          {option || null}
          <button
            className="w-6 text-font-color hover:text-font-color-accent focus:text-font-color-accent"
            type="button"
            onClick={onClose}
            onKeyDown={closeBtnOnKeyDown}
            ref={closeBtnRef}
            aria-label="Cerrar Modal"
            title="Cerrar Modal"
          >
            <XMarkIcon />
          </button>
        </div>
      </section>
    </div>
  )
}
