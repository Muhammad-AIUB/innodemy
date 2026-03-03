import api from "../../../api/axios";
import type { CourseAnalytics, ModuleLessonEngagement } from "./types";

export const courseAnalyticsApi = {
    getCourseAnalytics: async (courseId: string): Promise<CourseAnalytics> => {
        const { data } = await api.get<{
            success: boolean;
            data: CourseAnalytics;
        }>(`/admin/courses/${courseId}/analytics`);

        return data.data;
    },
    getCourseLessonEngagement: async (
        courseId: string,
    ): Promise<ModuleLessonEngagement[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: ModuleLessonEngagement[];
        }>(`/admin/courses/${courseId}/lesson-engagement`);

        return data.data;
    },
};
