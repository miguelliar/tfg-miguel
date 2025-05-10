"use server"

import {
  DocumentArrowUpIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid"
import Link from "next/link"

export default async function Page() {
  return (
    <>
      <h1 className="text-4xl m-5">Añadir proyectos</h1>
      <ul className="ml-7">
        <li>
          <Link
            href="/proyectos/crear/nuevo"
            className="flex flex-row text-xl gap-2"
          >
            <DocumentPlusIcon className="w-5" />
            Crear un proyecto manualmente
          </Link>
        </li>
        <li>
          <Link
            href="/proyectos/crear/subida"
            className="flex flex-row text-xl gap-2"
          >
            <DocumentArrowUpIcon className="w-5" />
            Añadir varios proyectos por fichero
          </Link>
        </li>
      </ul>
    </>
  )
}
