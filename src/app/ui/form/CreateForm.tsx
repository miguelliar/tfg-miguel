import { HTMLInputTypeAttribute } from "react";

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
            <div className="flex flex-col justify-start">
                {fields.map(field => {
                    return (
                    <div key={field.id} id={field.id} className="flex flex-row justify-center mb-4">
                        <label htmlFor={field.id} className="mr-4 w-full">{field.label}</label>
                        <input
                        className="bg-black w-full"
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        />
                    </div>);
                })}
            </div>
            <button type="submit" className="bg-blue-700">{submitText}</button>
        </form>);
}