'use server';
import { CreateForm, CreateFormParams } from "@/app/ui/form/CreateForm";
import { createProyecto } from "../../../../db/db";
import { fields } from './constants.json';

export default async function Page() {
    const formParams : CreateFormParams = {
        createCallback: createProyecto,
        fields,
        submitText: "Crear proyecto"
    };
    
    return (
    <CreateForm {...formParams}/>);
}