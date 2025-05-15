import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="flex flex-col py-3 md:flex-row justify-center gap-1 md:gap-5 items-center bg-primary text-secondary">
      <Link
        className="text-secondary hover:text-secondary-soft hover:underline"
        href="/about"
      >
        Sobre <strong>Gestor de Proyectos de Investigación</strong>
      </Link>
      <p>Por Miguel Ligero Arbesú, 2024-2025</p>
    </footer>
  )
}
