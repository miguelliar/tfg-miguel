"use client"

import cx from "classnames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { Breadcrumbs } from "./breadcrumbs/Breadcrumbs"

export function HeaderNavigation(): JSX.Element {
  const url = usePathname()

  const headerLinks = useMemo(
    () => [
      { title: "Inicio", url: "/home" },
      { title: "Proyectos", url: "/proyectos" },
      { title: "Investigadores", url: "/investigadores" },
    ],
    []
  )

  return (
    <header className="flex flex-col bg-font-color text-highlight-background-color">
      <section className="flex justify-center">
        {headerLinks.map((link) => (
          <Link
            key={`HeaderLink-${link.title}`}
            className={cx("mx-5 my-2 rounded px-2", {
              "bg-highlight-color": (url as string).startsWith(link.url),
            })}
            href={link.url}
          >
            {link.title}
          </Link>
        ))}
      </section>
      <section>
        <Breadcrumbs />
      </section>
    </header>
  )
}
