import { useNavigate } from "react-router-dom";
import { useAdminForm } from "../../shared/forms/useAdminForm";
import { webinarSchema, type WebinarFormValues } from "../schema";
import { useCreateWebinarMutation } from "../hooks";
import type { FormSubmitHandler } from "../../shared/forms/form.types";
import FormErrorMessage from "../../shared/forms/FormErrorMessage";
import FormSection from "../../shared/forms/FormSection";
import FileUploader from "../../shared/upload/FileUploader";
import InstructorSelector from "../components/InstructorSelector";

const splitLines = (raw?: string): string[] =>
    raw
        ? raw
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

const CreateWebinarPage = () => {
    const navigate = useNavigate();
    const mutation = useCreateWebinarMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useAdminForm<WebinarFormValues>({
        schema: webinarSchema,
        defaultValues: {
            title: "",
            description: "",
            date: "",
            duration: 60,
            image: "",
            time: "",
            instructorId: "",
            instructor: "",
            instructorImage: "",
            category: "",
            sectionOneTitle: "",
            sectionOnePointsRaw: "",
            sectionTwoTitle: "",
            sectionTwoPointsRaw: "",
        },
    });

    const onSubmit: FormSubmitHandler<WebinarFormValues> = (data) => {
        mutation.mutate(
            {
                title: data.title,
                description: data.description,
                date: new Date(data.date).toISOString(),
                duration: data.duration,
                image: data.image || undefined,
                time: data.time || undefined,
                instructorId: data.instructorId || undefined,
                category: data.category || undefined,
                sectionOneTitle: data.sectionOneTitle || undefined,
                sectionOnePoints: splitLines(data.sectionOnePointsRaw),
                sectionTwoTitle: data.sectionTwoTitle || undefined,
                sectionTwoPoints: splitLines(data.sectionTwoPointsRaw),
            },
            {
                onSuccess: () => navigate("/admin/webinars"),
            },
        );
    };

    return (
        <div className="mx-auto max-w-2xl p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Create Webinar
            </h1>

            {mutation.error && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3">
                    <FormErrorMessage error={mutation.error.message} />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSection title="Basic Information">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Webinar title"
                        />
                        <FormErrorMessage error={errors.title?.message} />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            {...register("description")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Webinar description"
                        />
                        <FormErrorMessage error={errors.description?.message} />
                    </div>

                    <div>
                        <FileUploader
                            value={watch("image") || ""}
                            onChange={(value) => setValue("image", value)}
                            type="image"
                            label="Webinar Image"
                            maxSizeMB={5}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>
                        <input
                            id="category"
                            type="text"
                            {...register("category")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="PROGRAMMING"
                        />
                    </div>
                </FormSection>

                <FormSection title="Schedule">
                    <div>
                        <label
                            htmlFor="date"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Date
                        </label>
                        <input
                            id="date"
                            type="datetime-local"
                            {...register("date")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <FormErrorMessage error={errors.date?.message} />
                    </div>

                    <div>
                        <label
                            htmlFor="time"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Time (display)
                        </label>
                        <input
                            id="time"
                            type="text"
                            {...register("time")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="3:00 PM - 4:00 PM"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="duration"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Duration (minutes)
                        </label>
                        <input
                            id="duration"
                            type="number"
                            step="1"
                            {...register("duration", { valueAsNumber: true })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="60"
                        />
                        <FormErrorMessage error={errors.duration?.message} />
                    </div>
                </FormSection>

                <FormSection title="Instructor">
                    <InstructorSelector
                        value={watch("instructorId") || ""}
                        onChange={(instructorId) =>
                            setValue("instructorId", instructorId)
                        }
                        error={errors.instructorId?.message}
                    />
                </FormSection>

                <FormSection title="Content Sections">
                    <div>
                        <label
                            htmlFor="sectionOneTitle"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Section 1 Title
                        </label>
                        <input
                            id="sectionOneTitle"
                            type="text"
                            {...register("sectionOneTitle")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="sectionOnePointsRaw"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Section 1 Points (one per line)
                        </label>
                        <textarea
                            id="sectionOnePointsRaw"
                            rows={4}
                            {...register("sectionOnePointsRaw")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder={"Point 1\nPoint 2\nPoint 3"}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="sectionTwoTitle"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Section 2 Title
                        </label>
                        <input
                            id="sectionTwoTitle"
                            type="text"
                            {...register("sectionTwoTitle")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="sectionTwoPointsRaw"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Section 2 Points (one per line)
                        </label>
                        <textarea
                            id="sectionTwoPointsRaw"
                            rows={4}
                            {...register("sectionTwoPointsRaw")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder={"Point A\nPoint B\nPoint C"}
                        />
                    </div>
                </FormSection>

                <button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? "Creating..." : "Create Webinar"}
                </button>
            </form>
        </div>
    );
};

export default CreateWebinarPage;
