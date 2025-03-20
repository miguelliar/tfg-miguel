"use client"

import ShowMoreText from "react-show-more-text"

import { Button } from "../button/Button"

interface HorizontalCardProps {
  id: string
  content: string
  onClick: () => void
  buttonText?: string
}

export const HorizontalCard = ({
  id,
  content,
  buttonText = "Ver",
  onClick,
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
      <Button className="p-0 px-2 text-sm" variant="fill" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  )
}
