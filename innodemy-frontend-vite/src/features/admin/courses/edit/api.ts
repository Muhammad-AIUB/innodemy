/**
 * Admin Edit Course — API Layer
 *
 * Contract aligned with backend:
 *   GET  /api/v1/courses/:id  → { success, data: AdminCourse }
 *   PATCH /api/v1/courses/:id → { success, data: AdminCourse }
 *
 * Uses centralized axios instance. Unwraps response envelope.
 * No side effects — pure HTTP communication.
 */

import api from "../../../../api/axios";
import type { AdminCourse } from "../types";
import type { EditCourseFormValues } from "./schema";
import type {
    GetAdminCourseResponse,
    UpdateAdminCourseResponse,
} from "./types";

export const editCourseApi = {
    /**
     * Fetch a single course by ID (admin).
     */
    getById: async (id: string): Promise<AdminCourse> => {
        const { data } = await api.get<GetAdminCourseResponse>(
            `/admin/courses/${id}`,
        );
        return data.data;
    },

    /**
     * Update a course by ID (admin).
     */
    update: async (
        id: string,
        payload: EditCourseFormValues,
    ): Promise<AdminCourse> => {
        const { data } = await api.patch<UpdateAdminCourseResponse>(
            `/admin/courses/${id}`,
            payload,
        );
        return data.data;
    },
};
