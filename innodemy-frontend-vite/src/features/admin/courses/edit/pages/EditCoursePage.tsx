/**
 * EditCoursePage — Admin edit course form page
 *
 * Flow:
 *   1. Extract course ID from URL params
 *   2. Fetch course data via useAdminCourseQuery
 *   3. Prefill form with defaultValues once data loads
 *   4. Submit via useUpdateAdminCourseMutation (PATCH)
 *   5. On success → alert + navigate back to list
 *
 * Uses useAdminForm for consistent Zod-based validation.
 * Same Phase 1 fields as CreateCoursePage.
 */

import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAdminForm } from "../../../shared/forms/useAdminForm";
import { editCourseSchema, type EditCourseFormValues } from "../schema";
import { useAdminCourseQuery, useUpdateAdminCourseMutation } from "../hooks";
import { useApiError } from "../../../../../hooks/useApiError";
import type { FormSubmitHandler } from "../../../shared/forms/form.types";
import FormErrorMessage from "../../../shared/forms/FormErrorMessage";
import FormSection from "../../../shared/forms/FormSection";
import FileUploader from "../../../shared/upload/FileUploader";

const EditCoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getErrorMessage } = useApiError();

    const {
        data: course,
        isLoading,
        isError,
        error: fetchError,
    } = useAdminCourseQuery(id);

    const mutation = useUpdateAdminCourseMutation(id!);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useAdminForm<EditCourseFormValues>({
        schema: editCourseSchema,
    });

    // Populate form with course data when it loads
    useEffect(() => {
        if (course) {
            reset({
                title: course.title,
                description: course.description,
                bannerImage: course.bannerImage,
                price: course.price,
                discountPrice: course.discountPrice,
                duration: course.duration,
                startDate: course.startDate
                    ? new Date(course.startDate).toISOString().slice(0, 16)
                    : "",
                classDays: course.classDays,
                classTime: course.classTime,
                totalModules: course.totalModules,
                totalProjects: course.totalProjects,
                totalLive: course.totalLive,
            });
        }
    }, [course, reset]);

    const onSubmit: FormSubmitHandler<EditCourseFormValues> = (data) => {
        const payload = {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
        };
        mutation.mutate(payload, {
            onSuccess: () => {
                alert("Updated successfully");
                navigate("/admin/courses");
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="py-4 text-gray-500">Loading course...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <p className="py-4 text-red-600">
                    {getErrorMessage(fetchError)}
                </p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-6">
                <p className="py-4 text-gray-500">Course not found.</p>
            </div>
        );
    }

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
                    Edit Course
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
                            Discount Price
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
                            placeholder="Mon, Wed, Fri"
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
                            placeholder="6:00 PM - 8:00 PM"
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
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditCoursePage;
