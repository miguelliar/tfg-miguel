"use client"

import type { ReactNode } from "react"
import ShowMoreText from "react-show-more-text"

interface HorizontalCardProps {
  id: string
  content: string
  children: ReactNode
}

export const HorizontalCard = ({
  id,
  content,
  children,
}: HorizontalCardProps) => {
  return (
    <div className="flex flex-row items-center justify-between max-w-[400px] w-full border rounded-md border-font-color gap-3 px-2">
      <h4 className="text-special-color text-base">{id}</h4>
      <ShowMoreText
        lines={1}
        more={
          <button className="text-gray-500 text-sm" type="button">
            Más...
          </button>
        }
        less={
          <button className="text-gray-500 text-sm" type="button">
            ...Menos
          </button>
        }
      >
        <p className="text-sm">{content}</p>
      </ShowMoreText>
      {children}
    </div>
  )
}
