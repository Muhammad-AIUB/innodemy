import { useFormContext } from "react-hook-form";
import FormErrorMessage from "./FormErrorMessage";

interface SingleImageUploadProps {
    name: string;
    label: string;
    placeholder?: string;
}

const SingleImageUpload = ({
    name,
    label,
    placeholder,
}: SingleImageUploadProps) => {
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;
    const imageUrl = watch(name);

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="url"
                placeholder={placeholder}
                {...register(name)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <FormErrorMessage error={error} />

            {imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "" && (
                <div className="mt-4 rounded-md border border-gray-200 p-2">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                        Preview:
                    </p>
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-64 rounded border border-gray-100 object-contain shadow-sm"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                        onLoad={(e) => {
                            (e.target as HTMLImageElement).style.display = "block";
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SingleImageUpload;
