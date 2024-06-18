import { HTMLInputTypeAttribute } from "react";
import './CreateForm.css';

export type FormField = {
    id: string,
    label: string,
    type: HTMLInputTypeAttribute,
    required: boolean,
    placeholder: string
}

export type CreateFormParams = {
    createCallback: (formData: FormData) => Promise<void>,
    fields: FormField[],
    submitText: string
};

export const CreateForm = ({createCallback, fields, submitText}: CreateFormParams) => {
    return (
        <form className="CreateForm" action={createCallback}>
            <div>
                {fields.map(field => {
                    return (
                    <div id={field.id}>
                        <label htmlFor={field.id}>{field.label}</label>
                        <input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        />
                    </div>);
                })}
            </div>
            <button type="submit" className="bg-white">{submitText}</button>
        </form>);
}