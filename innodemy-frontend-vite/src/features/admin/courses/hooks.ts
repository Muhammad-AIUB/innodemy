/**
 * Admin Courses — React Query Hooks
 *
 * Contract aligned with: docs/backend-admin-courses-api.md
 * Backend endpoint: GET /api/v1/courses
 */

import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { adminCoursesApi } from "./api";
import type { AdminCourse, AdminCoursesQueryParams } from "./types";

/**
 * Fetches paginated admin courses list.
 * Supports filtering by page, limit, search, and status.
 */
export const useAdminCoursesQuery = (params?: AdminCoursesQueryParams) => {
    return useQuery({
        queryKey: ["adminCourses", params] as const,
        queryFn: () => adminCoursesApi.getAdminCourses(params),
        placeholderData: keepPreviousData,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * Publish a draft course via PATCH /api/v1/courses/:id/publish.
 * Invalidates adminCourses list and single course cache on success.
 */
export const usePublishCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<AdminCourse, Error, string>({
        mutationFn: (id: string) => adminCoursesApi.publishCourse(id),
        retry: false,
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
            queryClient.invalidateQueries({ queryKey: ["adminCourse", id] });
        },
    });
};

/**
 * Soft-delete a course via DELETE /api/v1/courses/:id.
 * Invalidates adminCourses list and single course cache on success.
 */
export const useDeleteCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: (id: string) => adminCoursesApi.deleteCourse(id),
        retry: false,
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
            queryClient.invalidateQueries({ queryKey: ["adminCourse", id] });
        },
    });
};
