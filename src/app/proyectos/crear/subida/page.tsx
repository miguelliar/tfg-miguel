import { DocumentArrowUpIcon } from "@heroicons/react/24/solid"

import { ProyectoFileUploaderForm } from "./uploadForm/ProyectoFileUploadForm"

export default async function Page() {
  return (
    <>
      <div className="flex flex-col m-5 items-center gap-3">
        <DocumentArrowUpIcon className="w-9" />
        <h1 className="text-4xl text-center">
          Añadir proyectos a través de archivo
        </h1>
      </div>
      <ProyectoFileUploaderForm />
    </>
  )
}
