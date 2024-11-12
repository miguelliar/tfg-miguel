"use server"

import Link from "next/link"

export default async function Page() {
  return (
    <main>
      <h1>Añadir proyectos</h1>
      <ul>
        <li>
          <Link href="/proyectos/crear/nuevo">
            Crear un proyecto manualmente
          </Link>
        </li>
        <li>
          <Link href="/proyectos/crear/subida">
            Añadir varios proyectos por fichero
          </Link>
        </li>
      </ul>
    </main>
  )
}
