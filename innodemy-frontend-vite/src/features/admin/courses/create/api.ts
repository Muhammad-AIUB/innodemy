/**
 * Admin Create Course — API Layer
 *
 * Contract aligned with backend: POST /api/v1/courses
 * Accepts Phase 1 form values (subset of full CreateCoursePayload).
 * As more fields are added to the form, the payload grows automatically
 * via CreateCourseFormValues inference from the Zod schema.
 */

import api from "../../../../api/axios";
import type { AdminCourse } from "../types";
import type { CreateCourseFormValues } from "./schema";
import type { CreateCourseResponse } from "./types";

export const createCourseApi = {
    create: async (payload: CreateCourseFormValues): Promise<AdminCourse> => {
        const { data } = await api.post<CreateCourseResponse>(
            "/admin/courses",
            payload,
        );
        return data.data;
    },
};
