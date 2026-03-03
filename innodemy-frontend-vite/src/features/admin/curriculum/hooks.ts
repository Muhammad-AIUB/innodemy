/**
 * Curriculum hooks — TanStack Query wrappers for modules & lessons.
 *
 * All mutations invalidate ['modules', courseId] to keep the tree in sync.
 * Components consume these hooks; they must NEVER call the API layer directly.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { curriculumApi } from "./api";
import type {
    CreateModulePayload,
    UpdateModulePayload,
    CreateLessonPayload,
    UpdateLessonPayload,
    ReorderDirection,
} from "./types";

// ─── Query ──────────────────────────────────────────────────

export const useModulesQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["modules", courseId],
        queryFn: () => curriculumApi.getModules(courseId),
        enabled: !!courseId,
    });
};

// ─── Module Mutations ───────────────────────────────────────

export const useCreateModuleMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateModulePayload) =>
            curriculumApi.createModule(courseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useUpdateModuleMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            moduleId,
            payload,
        }: {
            moduleId: string;
            payload: UpdateModulePayload;
        }) => curriculumApi.updateModule(moduleId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useDeleteModuleMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (moduleId: string) => curriculumApi.deleteModule(moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useReorderModuleMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            moduleId,
            direction,
        }: {
            moduleId: string;
            direction: ReorderDirection;
        }) => curriculumApi.reorderModule(moduleId, direction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
        retry: false,
    });
};

// ─── Lesson Mutations ───────────────────────────────────────

export const useCreateLessonMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            moduleId,
            payload,
        }: {
            moduleId: string;
            payload: CreateLessonPayload;
        }) => curriculumApi.createLesson(moduleId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useUpdateLessonMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lessonId,
            payload,
        }: {
            lessonId: string;
            payload: UpdateLessonPayload;
        }) => curriculumApi.updateLesson(lessonId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useDeleteLessonMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: string) => curriculumApi.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
    });
};

export const useReorderLessonMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lessonId,
            direction,
        }: {
            lessonId: string;
            direction: ReorderDirection;
        }) => curriculumApi.reorderLesson(lessonId, direction),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
        },
        retry: false,
    });
};
