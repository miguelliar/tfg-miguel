import { ProyectoFileUploaderForm } from "@/app/ui"

export default async function Page() {
  return (
    <>
      <h1 className="text-4xl m-5">Añadir proyectos a través de archivo</h1>
      <ProyectoFileUploaderForm />
    </>
  )
}
