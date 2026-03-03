import api from "../../../api/axios";
import type {
    CourseProgressResponse,
    MarkLessonCompleteResponse,
} from "./types";

export const progressApi = {
    getCourseProgress: async (
        courseId: string,
    ): Promise<CourseProgressResponse> => {
        const { data } = await api.get<{
            success: boolean;
            data: CourseProgressResponse;
        }>(`/progress/${courseId}`);
        return data.data;
    },

    markLessonComplete: async (
        lessonId: string,
    ): Promise<MarkLessonCompleteResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: MarkLessonCompleteResponse;
        }>("/progress/complete", { lessonId });
        return data.data;
    },
};
