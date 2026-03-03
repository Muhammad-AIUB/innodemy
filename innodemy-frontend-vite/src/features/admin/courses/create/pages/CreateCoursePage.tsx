import { useNavigate, Link } from "react-router-dom";
import { useAdminForm } from "../../../shared/forms/useAdminForm";
import { createCourseSchema, type CreateCourseFormValues } from "../schema";
import { useCreateCourseMutation } from "../hooks";
import type { FormSubmitHandler } from "../../../shared/forms/form.types";
import FormErrorMessage from "../../../shared/forms/FormErrorMessage";
import FormSection from "../../../shared/forms/FormSection";
import FileUploader from "../../../shared/upload/FileUploader";

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const mutation = useCreateCourseMutation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useAdminForm<CreateCourseFormValues>({
        schema: createCourseSchema,
        defaultValues: {
            title: "",
            description: "",
            bannerImage: "",
            price: 0,
            discountPrice: undefined,
            duration: 90,
            startDate: "",
            classDays: "",
            classTime: "",
            totalModules: 0,
            totalProjects: 0,
            totalLive: 0,
        },
    });

    const onSubmit: FormSubmitHandler<CreateCourseFormValues> = (data) => {
        // Convert datetime-local to ISO-8601 format
        const payload = {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
        };

        mutation.mutate(payload, {
            onSuccess: () => {
                navigate("/admin/courses");
            },
        });
    };

    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="mb-6">
                <Link
                    to="/admin/courses"
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to Courses
                </Link>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Create Course
                </h1>
            </div>

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
                            placeholder="Course title"
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
                            rows={4}
                            {...register("description")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Course description"
                        />
                        <FormErrorMessage error={errors.description?.message} />
                    </div>

                    <div>
                        <FileUploader
                            value={watch("bannerImage")}
                            onChange={(value) => setValue("bannerImage", value)}
                            type="image"
                            label="Banner Image"
                            error={errors.bannerImage?.message}
                            maxSizeMB={5}
                        />
                    </div>
                </FormSection>

                <FormSection title="Pricing & Duration">
                    <div>
                        <label
                            htmlFor="price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price", { valueAsNumber: true })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0.00"
                        />
                        <FormErrorMessage error={errors.price?.message} />
                    </div>

                    <div>
                        <label
                            htmlFor="discountPrice"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Discount Price (optional)
                        </label>
                        <input
                            id="discountPrice"
                            type="number"
                            step="0.01"
                            {...register("discountPrice", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0.00"
                        />
                        <FormErrorMessage
                            error={errors.discountPrice?.message}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="duration"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Duration (days)
                        </label>
                        <input
                            id="duration"
                            type="number"
                            step="1"
                            {...register("duration", { valueAsNumber: true })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="90"
                        />
                        <FormErrorMessage error={errors.duration?.message} />
                    </div>
                </FormSection>

                <FormSection title="Schedule">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            {...register("startDate")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <FormErrorMessage error={errors.startDate?.message} />
                    </div>

                    <div>
                        <label
                            htmlFor="classDays"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Class Days
                        </label>
                        <input
                            id="classDays"
                            type="text"
                            {...register("classDays")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Sat, Sun"
                        />
                        <FormErrorMessage error={errors.classDays?.message} />
                    </div>

                    <div>
                        <label
                            htmlFor="classTime"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Class Time
                        </label>
                        <input
                            id="classTime"
                            type="text"
                            {...register("classTime")}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="10:00 AM - 12:00 PM"
                        />
                        <FormErrorMessage error={errors.classTime?.message} />
                    </div>
                </FormSection>

                <FormSection title="Course Stats">
                    <div>
                        <label
                            htmlFor="totalModules"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Total Modules
                        </label>
                        <input
                            id="totalModules"
                            type="number"
                            step="1"
                            {...register("totalModules", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0"
                        />
                        <FormErrorMessage
                            error={errors.totalModules?.message}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="totalProjects"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Total Projects
                        </label>
                        <input
                            id="totalProjects"
                            type="number"
                            step="1"
                            {...register("totalProjects", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0"
                        />
                        <FormErrorMessage
                            error={errors.totalProjects?.message}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="totalLive"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Total Live Sessions
                        </label>
                        <input
                            id="totalLive"
                            type="number"
                            step="1"
                            {...register("totalLive", { valueAsNumber: true })}
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0"
                        />
                        <FormErrorMessage error={errors.totalLive?.message} />
                    </div>
                </FormSection>

                <button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? "Creating..." : "Create Course"}
                </button>
            </form>
        </div>
    );
};

export default CreateCoursePage;
