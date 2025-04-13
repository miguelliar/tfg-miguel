import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="flex flex-col py-3 md:flex-row justify-center gap-1 md:gap-5 items-center bg-font-color text-background-color">
      <Link className="hover:text-background-color" href="/about">
        Sobre <b>Gestor de Proyectos de Investigación</b>
      </Link>
      <p>Por Miguel Ligero Arbesú, 2024-2025</p>
    </footer>
  )
}
