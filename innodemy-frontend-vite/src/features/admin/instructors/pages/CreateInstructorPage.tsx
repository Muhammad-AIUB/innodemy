import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateInstructorMutation } from "../hooks";
import FormErrorMessage from "../../shared/forms/FormErrorMessage";
import FormSection from "../../shared/forms/FormSection";
import FileUploader from "../../shared/upload/FileUploader";

const instructorSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters"),
    image: z.string().optional(),
    bio: z.string().optional(),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

const CreateInstructorPage = () => {
    const navigate = useNavigate();
    const mutation = useCreateInstructorMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<InstructorFormValues>({
        resolver: zodResolver(instructorSchema),
        defaultValues: {
            name: "",
            image: "",
            bio: "",
        },
    });

    const onSubmit = (data: InstructorFormValues) => {
        mutation.mutate(
            {
                name: data.name,
                image: data.image || undefined,
                bio: data.bio || undefined,
            },
            {
                onSuccess: () => navigate("/admin/instructors"),
            },
        );
    };

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Add New Instructor
            </h1>

            {mutation.error && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3">
                    <FormErrorMessage error={mutation.error.message} />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSection title="Instructor Information">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register("name")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Instructor name"
                        />
                        <FormErrorMessage error={errors.name?.message} />
                    </div>

                    <div>
                        <FileUploader
                            value={watch("image") || ""}
                            onChange={(value) => setValue("image", value)}
                            type="image"
                            label="Instructor Photo"
                            maxSizeMB={3}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="bio"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            rows={5}
                            {...register("bio")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Brief bio about the instructor..."
                        />
                        <FormErrorMessage error={errors.bio?.message} />
                    </div>
                </FormSection>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {mutation.isPending
                            ? "Creating..."
                            : "Create Instructor"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/instructors")}
                        className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInstructorPage;
