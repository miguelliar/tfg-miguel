"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import cx from "classnames"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { generatePagination } from "../utils/pagination"

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams?.get?.("page")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams ?? "")
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <div className="inline-flex justify-center m-2">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
        ariaLabel="Página anterior"
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined

          if (index === 0) position = "first"
          if (index === allPages.length - 1) position = "last"
          if (allPages.length === 1) position = "single"
          if (page === "...") position = "middle"

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          )
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        ariaLabel="Siguiente página"
      />
    </div>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string
  href: string
  position?: "first" | "last" | "middle" | "single"
  isActive: boolean
}) {
  const className = cx(
    "flex h-10 w-10 items-center justify-center text-sm border box-border transition-all",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "bg-bg-accent border-font-accent text-secondary": isActive,
      "hover:text-primary-strong hover:border-primary-strong hover:z-10":
        !isActive && position !== "middle",
    }
  )

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
  ariaLabel,
}: {
  href: string
  direction: "left" | "right"
  ariaLabel: string
  isDisabled?: boolean
}) {
  const className = cx(
    "flex h-10 w-10 items-center justify-center rounded-md border transition-all",
    {
      "pointer-events-none text-primary-disabled": isDisabled,
      "hover:text-primary-strong hover:border-primary-strong": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  )

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" title={ariaLabel} />
    ) : (
      <ArrowRightIcon className="w-4" title={ariaLabel} />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href} aria-label={ariaLabel}>
      {icon}
    </Link>
  )
}
