import "./globals.css"

import cx from "classnames"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { HeaderNavigation } from "./ui/HeaderNavigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  applicationName: "GPI",
  authors: {
    name: "Miguel Ligero Arbesu",
    url: "https://github.com/miguelliar",
  },
  title: "GPI: Gestor de proyectos de investigación",
  description: "Gestor de proyectos de investigación e investigadores",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cx("bg-background-color text-font-color", inter.className)}
      >
        <HeaderNavigation />
        {children}
      </body>
    </html>
  )
}
