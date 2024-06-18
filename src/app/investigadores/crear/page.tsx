'use server';
import { createInvestigador } from "../../../../db/db";
import './styles.css';

export default async function Page() {
    return (
    <form className="InvestigadorForm" action={createInvestigador}>
        <div>
            <label htmlFor="nombre_autor">Nombre de autor</label>
            <input
            id="nombre_autor"
            name="nombre_autor"
            type="text"
            required={true}
            placeholder="Introduce el nombre de autor..."></input>
        </div>
        <div>
            <label htmlFor="universidad">Universidad</label>
            <input
            id="universidad"
            name="universidad"
            type="text"
            required={true}
            placeholder="Universidad del investigador..."></input>
        </div>
        <div>
            <label htmlFor="departamento">departamento</label>
            <input
            id="departamento"
            name="departamento"
            type="text"
            required={true}
            placeholder="Departamento del investigador..."></input>
        </div>
        <div>            
            <label htmlFor="area">area</label>
            <input
            id="area"
            name="area"
            type="text"
            required={true}
            placeholder="Area de estudio del departamento..."></input>
        </div>
        <div>
            <label htmlFor="figura">Figura</label>
            <input
            id="figura"
            name="figura"
            type="text"
            required={true}
            placeholder="Figura del autor..."></input>
        </div>
        <div>
            <label htmlFor="miembro">Miembro</label>
            <input
            id="miembro"
            name="miembro"
            type="date"
            placeholder="Miembro..."></input>
        </div>
        <button type="submit" className="bg-white">Crear investigador</button>
    </form>);
}