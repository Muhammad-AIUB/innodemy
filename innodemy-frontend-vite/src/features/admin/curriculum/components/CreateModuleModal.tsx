import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createModuleSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
});

type CreateModuleFormValues = z.infer<typeof createModuleSchema>;

interface CreateModuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateModuleFormValues) => void;
    isPending: boolean;
}

const CreateModuleModal = ({
    isOpen,
    onClose,
    onSubmit,
    isPending,
}: CreateModuleModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateModuleFormValues>({
        resolver: zodResolver(createModuleSchema),
        defaultValues: {
            title: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const handleFormSubmit = (data: CreateModuleFormValues) => {
        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        Create Module
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Module Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                {...register("title")}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Enter module title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPending ? "Creating..." : "Create Module"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModuleModal;
