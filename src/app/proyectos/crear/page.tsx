'use server';
import { createProyecto } from "../../../../db/db";
import './styles.css';

export default async function Page() {
    return (
    <form className="ProyectoForm" action={createProyecto}>
        <div>
            <label htmlFor="codigo">Codigo</label>
            <input
            id="codigo"
            name="codigo"
            type="text"
            required={true}
            placeholder="Introduce el codigo para el proyecto..."></input>
        </div>
        <div>
            <label htmlFor="ip">Investigador Principal</label>
            <input
            id="ip"
            name="ip"
            type="text"
            required={true}
            placeholder="Nombre del investigador principal..."></input>
        </div>
        <div>
            <label htmlFor="titulo">Titulo</label>
            <input
            id="titulo"
            name="titulo"
            type="text"
            required={true}
            placeholder="Titulo del proyecto..."></input>
        </div>
        <div>            
            <label htmlFor="financiado">Entidad financiadora</label>
            <input
            id="financiado"
            name="financiado"
            type="text"
            required={true}
            placeholder="Entidad financiadora..."></input>
        </div>
        <div>
            <label htmlFor="inicio">Fecha de inicio del proyecto</label>
            <input
            id="inicio"
            name="inicio"
            type="date"
            required={true}
            placeholder="Introduce la fecha de inicio..."></input>
        </div>
        <div>
            <label htmlFor="fin">Fecha de finalización del proyecto (opcional)</label>
            <input
            id="fin"
            name="fin"
            type="date"
            placeholder="Introduce la fecha de fin..."></input>
        </div>
        <button type="submit" className="bg-white">Crear proyecto</button>
    </form>);
}