import "./globals.css"

import cx from "classnames"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Footer } from "./ui/Footer"
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
        className={cx(
          "bg-secondary text-font-color flex flex-col w-full",
          inter.className
        )}
      >
        <HeaderNavigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
