'use server';
import { CreateForm, CreateFormParams } from "@/app/ui/form/CreateForm";
import { createProyecto } from "../../../../db/db";

export default async function Page() {
    const formParams : CreateFormParams = {
        createCallback: createProyecto,
        fields: [
        {
            id: "codigo",
            label: "Codigo",
            type: "text",
            required: true,
            placeholder: "Introduce el codigo para el proyecto..."
        },
        {
            id: "ip",
            label: "Investigador Principal",
            type: "text",
            required: true,
            placeholder: "Nombre del investigador principal..."
        },
        {
            id: "titulo",
            label: "Titulo",
            type: "text",
            required: true,
            placeholder: "Titulo del proyecto..."
        },
        {
            id: "financiado",
            label: "Entidad financiadora",
            type: "text",
            required: true,
            placeholder: "Entidad financiadora..."
        },
        {
            id: "inicio",
            label: "Fecha de inicio del proyecto",
            type: "date",
            required: true,
            placeholder: "Introduce la fecha de inicio..."
        },
        {
            id: "fin",
            label: "Fecha de finalización del proyecto (opcional)",
            type: "date",
            required: true,
            placeholder: "Introduce la fecha de fin..."
        },],
        submitText: "Crear proyecto"
    };
    
    return (
    <CreateForm {...formParams}/>);
}