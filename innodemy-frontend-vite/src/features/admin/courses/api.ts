/**
 * Admin Courses — API Layer
 *
 * Contract aligned with: docs/backend-admin-courses-api.md
 * Backend endpoint: GET /api/v1/courses
 */

import api from "../../../api/axios";
import type {
    AdminCourse,
    AdminCoursesQueryParams,
    PaginatedAdminCoursesResponse,
} from "./types";

export const adminCoursesApi = {
    /**
     * Fetch paginated admin courses list.
     * Unwraps the `{ success, data, meta }` backend envelope.
     */
    getAdminCourses: async (
        params?: AdminCoursesQueryParams,
    ): Promise<PaginatedAdminCoursesResponse> => {
        const { data } = await api.get<
            { success: boolean } & PaginatedAdminCoursesResponse
        >("/admin/courses", { params });
        return { data: data.data, meta: data.meta };
    },

    /**
     * Publish a draft course.
     * Backend validates required fields before allowing publish.
     * PATCH /api/v1/courses/:id/publish
     */
    publishCourse: async (id: string): Promise<AdminCourse> => {
        const { data } = await api.patch<{
            success: boolean;
            data: AdminCourse;
        }>(`/admin/courses/${id}/publish`);
        return data.data;
    },

    /**
     * Soft-delete a course.
     * DELETE /api/v1/courses/:id
     * Backend sets isDeleted = true; row is not removed.
     */
    deleteCourse: async (id: string): Promise<void> => {
        await api.delete<{ success: boolean; data: null }>(
            `/admin/courses/${id}`,
        );
    },
};
