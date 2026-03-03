/**
 * Admin Create Course — React Query Hook
 *
 * Wraps useMutation for course creation.
 * Error normalization is handled automatically by the axios interceptor
 * (all errors are surfaced as AppError).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppError } from "../../../../api/error";
import type { AdminCourse } from "../types";
import type { CreateCourseFormValues } from "./schema";
import { createCourseApi } from "./api";

export const useCreateCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<AdminCourse, AppError, CreateCourseFormValues>({
        mutationFn: createCourseApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
        },
    });
};
