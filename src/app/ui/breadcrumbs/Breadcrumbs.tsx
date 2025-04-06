"use client"

import { usePathname } from "next/navigation"

import { Crumb } from "./Crumb"
import { useBreadcrumbs } from "./useBreadcrumbs"

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const crumbs = useBreadcrumbs(pathname ?? "")

  return (
    <ol className="flex flex-row pl-5 pb-2">
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
      <li className="text-background-color font-bold">
        {crumbs[crumbs.length - 1]?.name}
      </li>
    </ol>
  )
}
