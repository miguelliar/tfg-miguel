'use server';
import { CreateForm, CreateFormParams } from "@/app/ui/form/CreateForm";
import { createInvestigador } from "../../../../db/db";
import { fields } from './constants.json';
import './styles.css';

export default async function Page() {
    const formParams : CreateFormParams = {
        createCallback: createInvestigador,
        fields,
        submitText: "Crear investigador"
    };
    
    return (
    <CreateForm {...formParams}/>);
}