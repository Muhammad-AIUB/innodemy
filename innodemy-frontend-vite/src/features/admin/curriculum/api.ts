/**
 * Curriculum API layer — all HTTP calls for modules & lessons.
 *
 * Uses the centralized axios instance from src/api/axios.ts.
 * Components must NEVER import this file; hooks.ts is the consumer.
 */

import api from "../../../api/axios";
import type {
    Module,
    Lesson,
    CreateModulePayload,
    UpdateModulePayload,
    CreateLessonPayload,
    UpdateLessonPayload,
    ReorderDirection,
} from "./types";

interface SuccessResponse<T> {
    success: boolean;
    data: T;
}

export const curriculumApi = {
    // ─── Modules ────────────────────────────────────────────

    getModules: async (courseId: string): Promise<Module[]> => {
        const { data } = await api.get<SuccessResponse<Module[]>>(
            `/courses/${courseId}/modules`,
        );
        return data.data;
    },

    createModule: async (
        courseId: string,
        payload: CreateModulePayload,
    ): Promise<Module> => {
        const { data } = await api.post<SuccessResponse<Module>>(
            `/courses/${courseId}/modules`,
            payload,
        );
        return data.data;
    },

    updateModule: async (
        moduleId: string,
        payload: UpdateModulePayload,
    ): Promise<Module> => {
        const { data } = await api.patch<SuccessResponse<Module>>(
            `/modules/${moduleId}`,
            payload,
        );
        return data.data;
    },

    deleteModule: async (moduleId: string): Promise<void> => {
        await api.delete(`/modules/${moduleId}`);
    },

    reorderModule: async (
        moduleId: string,
        direction: ReorderDirection,
    ): Promise<void> => {
        await api.patch(`/modules/${moduleId}/reorder`, { direction });
    },

    // ─── Lessons ────────────────────────────────────────────

    createLesson: async (
        moduleId: string,
        payload: CreateLessonPayload,
    ): Promise<Lesson> => {
        const { data } = await api.post<SuccessResponse<Lesson>>(
            `/modules/${moduleId}/lessons`,
            payload,
        );
        return data.data;
    },

    updateLesson: async (
        lessonId: string,
        payload: UpdateLessonPayload,
    ): Promise<Lesson> => {
        const { data } = await api.patch<SuccessResponse<Lesson>>(
            `/lessons/${lessonId}`,
            payload,
        );
        return data.data;
    },

    deleteLesson: async (lessonId: string): Promise<void> => {
        await api.delete(`/lessons/${lessonId}`);
    },

    reorderLesson: async (
        lessonId: string,
        direction: ReorderDirection,
    ): Promise<void> => {
        await api.patch(`/lessons/${lessonId}/reorder`, { direction });
    },
};
