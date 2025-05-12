"use client"

import {
  Bars3Icon,
  DocumentMagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/solid"
import cx from "classnames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import LogoMini from "../../app/assets/logo-mini.svg"
import { Button } from "../button/Button"
import { CardModal } from "../cards"
import { Breadcrumbs } from "./breadcrumbs/Breadcrumbs"

const pageLinks = [
  {
    title: "Proyectos",
    url: "/proyectos",
    icon: <DocumentMagnifyingGlassIcon className="w-6" />,
  },
  {
    title: "Investigadores",
    url: "/investigadores",
    icon: <UsersIcon className="w-6" />,
  },
]

const PageLinks = ({ url, onOpen }: { url: string; onOpen?: () => void }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-3">
      {pageLinks.map((link) => (
        <Link
          key={`HeaderLink-${link.title}`}
          onClick={onOpen}
          className={cx(
            "text-2xl text-primary sm:text-base sm:text-secondary hover:text-secondary hover:bg-accent-primary h-full my-1 rounded px-2 pt-1 items-center w-full sm:w-fit text-center overflow-auto text-ellipsis sm:flex",
            {
              "sm:bg-accent-primary": url.startsWith(link.url),
              "bg-accent-primary text-secondary":
                onOpen && url.startsWith(link.url),
              hidden: !onOpen && !url.startsWith(link.url),
              "text-secondary hover:text-secondary hover:bg-primary sm:hover:bg-accent-primary":
                !onOpen && url.startsWith(link.url),
            }
          )}
          href={link.url}
        >
          <div className="flex flex-row justify-center gap-2">
            {link.icon}
            {link.title}
          </div>
        </Link>
      ))}
    </div>
  )
}

export function HeaderNavigation(): JSX.Element {
  const url = usePathname()
  const [isMobileNavMenu, setIsMobileNavMenu] = useState(false)

  return (
    <>
      <header className="flex flex-row bg-primary text-secondary">
        <section className="flex justify-center w-full h-12 sm:h-14 ">
          <Link className="absolute top-0 left-0" href="/">
            <p className="sr-only">Página Inicial</p>
            <LogoMini
              className="text-secondary w-12 sm:w-14 hover:scale-110 transition"
              alt="GPI logo"
            />
          </Link>
          <PageLinks url={url as string} />
          <Button
            variant="minimal"
            className="sm:hidden absolute right-0 top-0"
            onClick={() => {
              setIsMobileNavMenu(!isMobileNavMenu)
            }}
          >
            <p className="sr-only">Abrir menú</p>
            <Bars3Icon className="text-secondary w-12 h-12" />
          </Button>
        </section>
      </header>
      <section>
        <Breadcrumbs />
      </section>
      {isMobileNavMenu && (
        <div className="block sm:hidden">
          <CardModal
            onClose={() => {
              setIsMobileNavMenu(!isMobileNavMenu)
            }}
          >
            <PageLinks
              url={url as string}
              onOpen={() => {
                setIsMobileNavMenu(false)
              }}
            />
          </CardModal>
        </div>
      )}
    </>
  )
}
