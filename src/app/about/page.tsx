import Link from "next/link"

import Logo from "../assets/logo.svg"

export default function About() {
  return (
    <>
      <Logo className="w-64 m-auto" />
      <div className="flex flex-col gap-12 justify-center px-6 m-auto max-w-3xl mb-16">
        <h1 className="text-4xl m-5 text-center">
          Sobre Gestor de Proyectos de Investigación (GPI)
        </h1>
        <section className="flex flex-col gap-2 justify-start items-center">
          <h2 className="text-2xl m-4">¿Por qué GPI?</h2>
          <p>
            GPI nace como una aplicación de gestión de proyectos proporcionando
            funcionalidades de gestión que otras herramientas no proporcionan.
          </p>
          <p>
            Su objetivo es proporcionar a los investigadores la posibilidad de
            subir sus proyectos, añadir las participaciones de otros
            investigadores y recopilar información relacionada.
          </p>
        </section>
        <section className="flex flex-col gap-2 justify-start">
          <h2 className="text-2xl m-4 text-center">¿Qué me ofrece GPI?</h2>
          <p>Con GPI puedes:</p>
          <ul className="list-disc ml-4">
            <li>
              Crear proyectos{" "}
              <Link href="/proyectos/crear/nuevo">
                <i>individualmente</i>
              </Link>{" "}
              o{" "}
              <Link href="/proyectos/crear/subida">
                <i>en grupo</i>
              </Link>{" "}
              a través de un archivo CSV con formato oficial
            </li>
            <li>
              Buscar{" "}
              <Link href="/proyectos">
                <i>proyectos</i>
              </Link>{" "}
              subidos a la plataforma y ver los investigadores participantes
            </li>
            <li>
              Buscar{" "}
              <Link href="/investigadores">
                <i>investigadores</i>
              </Link>{" "}
              subidos, ver los proyectos en los que participan y sus nombres de
              autor
            </li>
            <li>
              Buscar en grupos de investigadores por distintos tipos de
              filtrado, como:
              <ul className="ml-4 list-[square]">
                <li>
                  Proyectos en los que participen todos los investigadores
                </li>
                <li>Proyectos en los que participe al menos un investigador</li>
                <li>
                  Proyectos en los que no participen en conjunto los
                  investigadores
                </li>
              </ul>
            </li>
            <li>
              Descargar en archivo CSV los resultados de la búsqueda de
              proyectos en grupo
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-2 justify-start items-center">
          <h2 className="text-2xl m-4">¿Dónde puedo contribuir a GPI?</h2>
          <p>
            GPI es un proyecto de fin de grado creado por Miguel Ligero Arbesú.
            Tras la finalización de este la contribución es libre a cualquiera
            que quiera a través del{" "}
            <a href="https://github.com/miguelliar/tfg-miguel">
              <i>repositorio público</i>
            </a>
          </p>
        </section>
      </div>
    </>
  )
}
