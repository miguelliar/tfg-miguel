import { ProyectoFileUploaderForm } from "@/app/ui/form/ProyectoFileUploadForm";

export default async function Page() {
    return (
        <main>
            <h1>Añadir proyectos a través de archivo</h1>
            <ProyectoFileUploaderForm />
        </main>
    );
} 