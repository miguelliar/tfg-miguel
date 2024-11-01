'use client'

import { useCallback, useMemo, useState } from "react";
import { ProjectTable } from "../tables/ProjectTable";
import { onFileChange } from "@/app/utils/fetchProject";
import { mapProyectoToUploadToProyectType, ProyectoToUpload } from "@/app/utils/mapProyecto";

export const ProyectoFileUploaderForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [uploadedProyecto, setUploadedProyecto] = useState<ProyectoToUpload[]>();
    const onChange = useCallback(((selectedFile: any) => 
        onFileChange(selectedFile, setUploadedProyecto ,setIsLoading)), []);
    const submitEnabled = useMemo(() => { return !Boolean(uploadedProyecto && uploadedProyecto?.length > 0)}, [uploadedProyecto]);

    return (
        <>
            <form className="CreateForm">
                <label htmlFor="proyectoFile">Elige un archivo .csv con los proyectos a subir</label>
                <input type="file" id="proyectoFile" name="proyectoFile" onChange={(event) => onChange(event.target.files?.[0])}/>
                <button type="submit" className="bg-blue-700" disabled={submitEnabled}>Submit</button>
            </form>
            <p>
                { isLoading ? ('Loading') : null}
            </p>
            <p>
                {!isLoading && uploadedProyecto ? 
                    <ProjectTable projectData={mapProyectoToUploadToProyectType(uploadedProyecto)}></ProjectTable> 
                    : null}
            </p>
        </>);
}
