import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Lesson } from "../types";
import FileUploader from "../../shared/upload/FileUploader";

const editLessonSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT"]),
    videoUrl: z
        .string()
        .refine(
            (val) => {
                if (!val || val === "") return true;
                // Accept full URLs or relative paths starting with /
                return (
                    val.startsWith("/") ||
                    val.startsWith("http://") ||
                    val.startsWith("https://")
                );
            },
            { message: "Must be a valid URL or path" },
        )
        .optional()
        .or(z.literal("")),
});

type EditLessonFormValues = z.infer<typeof editLessonSchema>;

interface EditLessonModalProps {
    isOpen: boolean;
    lesson: Lesson | null;
    onClose: () => void;
    onSubmit: (data: EditLessonFormValues) => void;
    isPending: boolean;
}

const EditLessonModal = ({
    isOpen,
    lesson,
    onClose,
    onSubmit,
    isPending,
}: EditLessonModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<EditLessonFormValues>({
        resolver: zodResolver(editLessonSchema),
    });

    const lessonType = watch("type");

    useEffect(() => {
        if (isOpen && lesson) {
            reset({
                title: lesson.title,
                type: lesson.type,
                videoUrl: lesson.videoUrl || "",
            });
        }
    }, [isOpen, lesson, reset]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const handleFormSubmit = (data: EditLessonFormValues) => {
        onSubmit(data);
    };

    if (!isOpen || !lesson) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        Edit Lesson
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
                                Lesson Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                {...register("title")}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Enter lesson title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="type"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Lesson Type
                            </label>
                            <select
                                id="type"
                                {...register("type")}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="VIDEO">Video</option>
                                <option value="ARTICLE">Article</option>
                                <option value="QUIZ">Quiz</option>
                                <option value="ASSIGNMENT">Assignment</option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        {lessonType === "VIDEO" && (
                            <FileUploader
                                value={watch("videoUrl") || ""}
                                onChange={(value) =>
                                    setValue("videoUrl", value)
                                }
                                type="video"
                                label="Video"
                                error={errors.videoUrl?.message}
                                maxSizeMB={100}
                            />
                        )}
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
                            {isPending ? "Updating..." : "Update Lesson"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLessonModal;
