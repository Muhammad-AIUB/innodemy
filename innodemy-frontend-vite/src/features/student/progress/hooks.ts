import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "./api";

export const useCourseProgressQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["progress", courseId],
        queryFn: () => progressApi.getCourseProgress(courseId),
        enabled: !!courseId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useMarkLessonCompleteMutation = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: string) =>
            progressApi.markLessonComplete(lessonId),
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["progress", courseId],
            });
        },
    });
};
