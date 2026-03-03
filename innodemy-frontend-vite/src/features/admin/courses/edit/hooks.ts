/**
 * Admin Edit Course — React Query Hooks
 *
 * useAdminCourseQuery  → GET /api/v1/courses/:id
 * useUpdateAdminCourseMutation → PATCH /api/v1/courses/:id
 *
 * Error normalization is handled automatically by the axios interceptor.
 * No navigation or UI side effects — consumers handle those.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppError } from "../../../../api/error";
import type { AdminCourse } from "../types";
import type { EditCourseFormValues } from "./schema";
import { editCourseApi } from "./api";

/**
 * Fetches a single admin course by ID.
 * Enabled only when id is truthy to avoid unnecessary requests.
 */
export const useAdminCourseQuery = (id: string | undefined) => {
    return useQuery<AdminCourse, AppError>({
        queryKey: ["adminCourse", id] as const,
        queryFn: () => editCourseApi.getById(id!),
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * Mutation hook for updating an admin course.
 * Invalidates both the list and single-course queries on success.
 */
export const useUpdateAdminCourseMutation = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation<AdminCourse, AppError, EditCourseFormValues>({
        mutationFn: (payload) => editCourseApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
            queryClient.invalidateQueries({ queryKey: ["adminCourse", id] });
        },
    });
};
