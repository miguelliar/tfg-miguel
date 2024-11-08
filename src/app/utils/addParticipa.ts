import { createParticipa, fetchProyectoByCode } from "@/db";


export const addParticipa = async (codigo: string, investigadorId: string) => {
    const proyectoId = (await fetchProyectoByCode(codigo))?.id;
    if (proyectoId) {
        createParticipa(
            Number.parseInt(proyectoId), 
            Number.parseInt(investigadorId)
        )
    }
}