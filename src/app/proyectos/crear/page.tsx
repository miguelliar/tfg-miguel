"use server"

import Link from "next/link"

export default async function Page() {
  return (
    <>
      <h1 className="text-4xl m-5">Añadir proyectos</h1>
      <ul className="ml-7">
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
    </>
  )
}
