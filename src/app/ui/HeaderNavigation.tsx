"use client"

import cx from "classnames"
import Link from "next/link"
import { usePathname } from "next/navigation"

import LogoMini from "../assets/logo-mini.svg"
import { Breadcrumbs } from "./breadcrumbs/Breadcrumbs"

const headerLinks = [
  { title: "Inicio", url: "/home" },
  { title: "Proyectos", url: "/proyectos" },
  { title: "Investigadores", url: "/investigadores" },
]

export function HeaderNavigation(): JSX.Element {
  const url = usePathname()

  return (
    <>
      <header className="flex flex-row bg-font-color text-background-color">
        <Link className="flex align-middle" href="/">
          <LogoMini
            className="text-background-color w-12 sm:w-14 hover:scale-110 transition"
            alt="GPI logo"
          />
        </Link>
        <section className="flex flex-row justify-start sm:justify-center items-center w-full gap-3">
          {headerLinks.map((link) => (
            <Link
              key={`HeaderLink-${link.title}`}
              className={cx(
                "hover:text-background-color hover:bg-special-color h-full my-1 rounded px-2 flex items-center",
                {
                  "bg-special-color": (url as string).startsWith(link.url),
                }
              )}
              href={link.url}
            >
              {link.title}
            </Link>
          ))}
        </section>
      </header>
      <section>
        <Breadcrumbs />
      </section>
    </>
  )
}
