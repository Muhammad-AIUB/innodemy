/**
 * Course Public Content API layer — admin CRUD for public sections.
 *
 * Uses the centralized axios instance from src/api/axios.ts.
 * Components must NEVER import this file; hooks.ts is the consumer.
 */

import api from "../../../api/axios";
import type {
    CoursePublicSection,
    CreateSectionPayload,
    UpdateSectionPayload,
    CoursePublicSectionType,
} from "./types";

interface SuccessResponse<T> {
    success: boolean;
    data: T;
}

export const coursePublicContentApi = {
    // ─── Admin Endpoints ────────────────────────────────────

    /** Get ALL sections (visible + hidden) for admin editing */
    getSections: async (courseId: string): Promise<CoursePublicSection[]> => {
        const { data } = await api.get<SuccessResponse<CoursePublicSection[]>>(
            `/admin/courses/${courseId}/public-content`,
        );
        return data.data;
    },

    /** Get a single section by id */
    getSection: async (
        id: string,
        courseId: string,
    ): Promise<CoursePublicSection> => {
        const { data } = await api.get<SuccessResponse<CoursePublicSection>>(
            `/admin/courses/${courseId}/public-content/${id}`,
        );
        return data.data;
    },

    /** Create a new section */
    createSection: async (
        courseId: string,
        payload: CreateSectionPayload,
    ): Promise<CoursePublicSection> => {
        const { data } = await api.post<SuccessResponse<CoursePublicSection>>(
            `/admin/courses/${courseId}/public-content`,
            payload,
        );
        return data.data;
    },

    /** Update an existing section */
    updateSection: async (
        courseId: string,
        sectionId: string,
        payload: UpdateSectionPayload,
    ): Promise<CoursePublicSection> => {
        const { data } = await api.patch<SuccessResponse<CoursePublicSection>>(
            `/admin/courses/${courseId}/public-content/${sectionId}`,
            payload,
        );
        return data.data;
    },

    /** Upsert a section by type (creates if not exists, updates if exists) */
    upsertSection: async (
        courseId: string,
        type: CoursePublicSectionType,
        payload: UpdateSectionPayload,
    ): Promise<CoursePublicSection> => {
        const { data } = await api.patch<SuccessResponse<CoursePublicSection>>(
            `/admin/courses/${courseId}/public-content/upsert/${type}`,
            payload,
        );
        return data.data;
    },

    /** Delete a section */
    deleteSection: async (
        courseId: string,
        sectionId: string,
    ): Promise<void> => {
        await api.delete(
            `/admin/courses/${courseId}/public-content/${sectionId}`,
        );
    },

    // ─── Public Endpoint ────────────────────────────────────

    /** Get only visible sections (public-facing) */
    getPublicSections: async (
        courseId: string,
    ): Promise<CoursePublicSection[]> => {
        const { data } = await api.get<SuccessResponse<CoursePublicSection[]>>(
            `/courses/${courseId}/public-content`,
        );
        return data.data;
    },
};
