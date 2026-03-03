/**
 * Admin Courses — Domain Types
 *
 * Contract aligned with: docs/backend-admin-courses-api.md
 * Backend endpoint: GET /api/v1/courses
 */

export type CourseStatus = "DRAFT" | "PUBLISHED";

export interface AdminCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    bannerImage: string;
    price: number;
    discountPrice: number | null;
    duration: number;
    startDate: string;
    classDays: string;
    classTime: string;
    totalModules: number;
    totalProjects: number;
    totalLive: number;
    status: CourseStatus;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminCoursesMeta {
    page: number;
    total: number;
    totalPages: number;
}

export interface PaginatedAdminCoursesResponse {
    data: AdminCourse[];
    meta: AdminCoursesMeta;
}

export interface AdminCoursesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: CourseStatus;
}
