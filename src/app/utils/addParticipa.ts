import { createParticipa } from "../../../db/tables/participa";
import { fetchProyectoByCode } from "../../../db/tables/proyecto";

export const addParticipa = async (codigo: string, investigadorId: string) => {
    const proyectoId = (await fetchProyectoByCode(codigo))?.id;
    if (proyectoId) {
        createParticipa(
            Number.parseInt(proyectoId), 
            Number.parseInt(investigadorId)
        )
    }
}