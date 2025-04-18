"use client"

import { Bars3Icon } from "@heroicons/react/24/solid"
import cx from "classnames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import LogoMini from "../assets/logo-mini.svg"
import { Breadcrumbs } from "./breadcrumbs/Breadcrumbs"
import { Button } from "./button/Button"
import { CardModal } from "./cards/CardModal"

const pageLinks = [
  { title: "Proyectos", url: "/proyectos" },
  { title: "Investigadores", url: "/investigadores" },
]

const PageLinks = ({ url, onOpen }: { url: string; onOpen?: () => void }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-3">
      {pageLinks.map((link) => (
        <Link
          key={`HeaderLink-${link.title}`}
          onClick={onOpen}
          className={cx(
            "text-2xl text-secondary sm:text-base hover:text-secondary hover:bg-accent-primary h-full my-1 rounded px-2 items-center",
            {
              "content sm:bg-accent-primary flex": url.startsWith(
                link.url
              ),
              "bg-accent-primary": onOpen && url.startsWith(link.url),
              "hidden sm:flex": !onOpen && !url.startsWith(link.url),
            }
          )}
          href={link.url}
        >
          {link.title}
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
