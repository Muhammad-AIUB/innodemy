import { useQuery } from "@tanstack/react-query";
import { courseAnalyticsApi } from "./api";

export const useCourseAnalyticsQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["courseAnalytics", courseId],
        queryFn: () => courseAnalyticsApi.getCourseAnalytics(courseId),
        enabled: !!courseId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useCourseLessonEngagementQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["courseLessonEngagement", courseId],
        queryFn: () => courseAnalyticsApi.getCourseLessonEngagement(courseId),
        enabled: !!courseId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};
