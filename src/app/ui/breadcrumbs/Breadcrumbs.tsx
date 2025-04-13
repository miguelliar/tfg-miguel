"use client"

import { usePathname } from "next/navigation"

import { Crumb } from "./Crumb"
import { useBreadcrumbs } from "./useBreadcrumbs"

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const crumbs = useBreadcrumbs(pathname ?? "")

  return (
    <ol className="flex flex-row pl-7 pb-2 flex-wrap">
      {crumbs.slice(1, crumbs.length - 1).map((crumb, index) => {
        return <Crumb key={crumb.url} crumb={crumb} level={index} />
      })}
      {crumbs.length > 2 && (
        <li className="text-font-color font-bold">
          {crumbs[crumbs.length - 1]?.name}
        </li>
      )}
    </ol>
  )
}
