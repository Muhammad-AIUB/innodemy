/**
 * Course Public Content hooks — TanStack Query wrappers.
 *
 * All mutations invalidate ['coursePublicSections', courseId].
 * Components consume these hooks; they must NEVER call the API directly.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coursePublicContentApi } from "./api";
import type {
    CreateSectionPayload,
    UpdateSectionPayload,
    CoursePublicSectionType,
} from "./types";

// ─── Queries ────────────────────────────────────────────────

/** Fetch ALL sections for admin editor */
export const useCoursePublicSectionsQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["coursePublicSections", courseId],
        queryFn: () => coursePublicContentApi.getSections(courseId),
        enabled: !!courseId,
    });
};

/** Fetch only visible sections for public display */
export const usePublicCourseSectionsQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["publicCourseSections", courseId],
        queryFn: () => coursePublicContentApi.getPublicSections(courseId),
        enabled: !!courseId,
        staleTime: 5 * 60_000,
    });
};

// ─── Mutations ──────────────────────────────────────────────

export const useCreateSectionMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSectionPayload) =>
            coursePublicContentApi.createSection(courseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coursePublicSections", courseId],
            });
        },
    });
};

export const useUpdateSectionMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            sectionId,
            payload,
        }: {
            sectionId: string;
            payload: UpdateSectionPayload;
        }) =>
            coursePublicContentApi.updateSection(courseId, sectionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coursePublicSections", courseId],
            });
        },
    });
};

export const useUpsertSectionMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            type,
            payload,
        }: {
            type: CoursePublicSectionType;
            payload: UpdateSectionPayload;
        }) => coursePublicContentApi.upsertSection(courseId, type, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coursePublicSections", courseId],
            });
        },
    });
};

export const useDeleteSectionMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sectionId: string) =>
            coursePublicContentApi.deleteSection(courseId, sectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["coursePublicSections", courseId],
            });
        },
    });
};
