"use client"

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
    <div className="flex flex-row items-center justify-between w-full border rounded-md border-font-color gap-3 px-2">
      <h4 className="text-special-color text-base">{id}</h4>
      <p className="text-sm">{content}</p>
      <Button className="p-0 px-2 text-sm" variant="fill" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  )
}
