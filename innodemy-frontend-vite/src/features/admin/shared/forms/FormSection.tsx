import type { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
    return (
        <fieldset className="mb-6">
            <legend className="mb-2 text-lg font-semibold text-gray-800">
                {title}
            </legend>
            <div className="space-y-4">{children}</div>
        </fieldset>
    );
};

export default FormSection;
