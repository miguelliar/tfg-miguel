'use client'

import { FormEvent, useCallback, useMemo, useState } from "react";
import { ProjectTable } from "../tables/ProjectTable";
import { onFileChange } from "@/app/utils/fetchProject";
import { mapProyectoToUploadToProyectType, ProyectoToUpload } from "@/app/utils/mapProyecto";
import { addAllProyectos } from "@/app/utils/addAllProyectos";

export const ProyectoFileUploaderForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoToUpload[]>();
    const [errorMessages, setErrorMessages] = useState<string[]>();

    const onChange = useCallback(((selectedFile: any) => 
        onFileChange(selectedFile, setUploadedProyecto ,setIsLoading)), []);
    const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(uploadedProyecto) {
            const proyectErrorMessageMap = await addAllProyectos(mapProyectoToUploadToProyectType(uploadedProyecto))
            if(proyectErrorMessageMap) {
                setErrorMessages(
                    proyectErrorMessageMap.map(
                        proyectoErrorPair => `${proyectoErrorPair[0].codigo}: ${proyectoErrorPair[1]}`
                    )
                );
            }
        }
    }, [uploadedProyecto]);

    const submitEnabled = useMemo(() => { return !Boolean(uploadedProyecto && uploadedProyecto?.length > 0)}, [uploadedProyecto]);

    return (
        <>
            <form className="CreateForm" onSubmit={(e) => onSubmit(e)}>
                <label htmlFor="proyectoFile">Elige un archivo .csv con los proyectos a subir</label>
                <input type="file" id="proyectoFile" name="proyectoFile" onChange={(event) => onChange(event.target.files?.[0])}/>
                <button type="submit" className="bg-blue-700" disabled={submitEnabled}>Submit</button>
            </form>
            <p>
                { isLoading ? ('Loading') : null}
            </p>
            {
                errorMessages && errorMessages.length > 0 ? 
                <section>
                    <h2>There has been the following problems:</h2>
                    <ul>
                        {errorMessages.map((errorMessage, index) => <li><p key={`ErrorMessage-${index}`}>{errorMessage}</p></li>)}
                    </ul>
                </section> 
                : null
            }
            {!isLoading && uploadedProyecto ? 
                <ProjectTable projectData={mapProyectoToUploadToProyectType(uploadedProyecto)}></ProjectTable> 
                : null}
        </>);
}
