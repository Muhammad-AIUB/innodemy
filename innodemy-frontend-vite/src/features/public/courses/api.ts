import api from "../../../api/axios";
import type {
    PublicCourse,
    PublicCoursesResponse,
    CoursePublicSection,
} from "./types";

export const publicCoursesApi = {
    getCourses: async (): Promise<PublicCourse[]> => {
        const { data } = await api.get<
            {
                success: boolean;
            } & PublicCoursesResponse
        >("/courses", {
            params: { limit: 100 },
        });
        return data.data;
    },

    getCourseBySlug: async (slug: string): Promise<PublicCourse> => {
        const { data } = await api.get<{
            success: boolean;
            data: PublicCourse;
        }>(`/courses/${slug}`);
        return data.data;
    },

    /** Get visible public sections for a course by courseId */
    getPublicSections: async (
        courseId: string,
    ): Promise<CoursePublicSection[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: CoursePublicSection[];
        }>(`/courses/${courseId}/public-content`);
        return data.data;
    },
};
