"use client"

import { usePathname } from "next/navigation"

import { Crumb } from "./Crumb"
import { useBreadcrumbs } from "./useBreadcrumbs"

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const crumbs = useBreadcrumbs(pathname ?? "")

  return (
    <ol className="flex flex-row">
      {crumbs.slice(0, crumbs.length - 1).map((crumb, index, array) => {
        return (
          <Crumb
            key={crumb.url}
            crumb={crumb}
            level={index}
            lastLevel={array.length}
          />
        )
      })}
      <span>{crumbs[crumbs.length - 1]?.name}</span>
    </ol>
  )
}
