/**
 * Admin Create Course — Domain Types
 *
 * Contract aligned with backend DTO: CreateCourseDto
 * Backend endpoint: POST /api/v1/courses
 *
 * CreateCoursePayload documents the FULL backend contract.
 * Do not add fields not present in the backend DTO.
 */

import type { AdminCourse } from "../types";

/**
 * Full payload accepted by POST /api/v1/courses.
 *
 * All fields are required unless marked optional, matching
 * the backend CreateCourseDto validation rules exactly.
 */
export interface CreateCoursePayload {
    title: string;
    description: string;
    bannerImage: string;
    price: number;
    discountPrice?: number;
    duration: number;
    startDate: string;
    classDays: string;
    classTime: string;
    totalModules: number;
    totalProjects: number;
    totalLive: number;
}

/**
 * Response envelope from POST /api/v1/courses.
 */
export interface CreateCourseResponse {
    success: boolean;
    data: AdminCourse;
}
