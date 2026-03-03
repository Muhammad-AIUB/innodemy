import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonContentApi } from "./api";
import type { AdminLessonContent, LessonContentBlock } from "./types";

export const useLessonByIdQuery = (lessonId: string) => {
    return useQuery({
        queryKey: ["lesson", lessonId],
        queryFn: () => lessonContentApi.getLessonById(lessonId),
        enabled: !!lessonId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useUpdateLessonContentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        AdminLessonContent,
        Error,
        { lessonId: string; courseId: string; content: LessonContentBlock[] }
    >({
        mutationFn: ({ lessonId, content }) =>
            lessonContentApi.updateLessonContent(lessonId, content),
        retry: false,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["modules", variables.courseId],
            });
        },
    });
};
