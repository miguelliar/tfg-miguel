'use server';
import { createInvestigadorWithForm } from "@/db";
import { CreateForm, CreateFormParams } from "@/app/ui";
import { fields } from './constants.json';

export default async function Page() {
    const formParams : CreateFormParams = {
        createCallback: createInvestigadorWithForm,
        fields,
        submitText: "Crear investigador"
    };
    
    return (
    <CreateForm {...formParams}/>);
}