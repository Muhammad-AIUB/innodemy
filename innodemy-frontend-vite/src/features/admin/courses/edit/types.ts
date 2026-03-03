/**
 * Admin Edit Course — Domain Types
 *
 * Contract aligned with backend:
 *   GET  /api/v1/courses/:id  → { success, data: AdminCourse }
 *   PATCH /api/v1/courses/:id → { success, data: AdminCourse }
 *
 * UpdateCoursePayload documents the PATCH body contract.
 * The GET response reuses the shared AdminCourse interface.
 */

import type { AdminCourse } from "../types";

/**
 * PATCH body — all fields optional, matching backend UpdateCourseDto
 * (PartialType of CreateCourseDto). Only Phase 1 fields are listed here.
 */
export interface UpdateCoursePayload {
    title?: string;
    description?: string;
    price?: number;
    duration?: number;
}

/**
 * Response envelope from GET /api/v1/courses/:id
 */
export interface GetAdminCourseResponse {
    success: boolean;
    data: AdminCourse;
}

/**
 * Response envelope from PATCH /api/v1/courses/:id
 */
export interface UpdateAdminCourseResponse {
    success: boolean;
    data: AdminCourse;
}
