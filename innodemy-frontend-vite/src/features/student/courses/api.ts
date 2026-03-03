import api from "../../../api/axios";
import type { CourseDetail, CoursesResponse } from "./types";

export const coursesApi = {
    getCourses: async (): Promise<CoursesResponse> => {
        const { data } = await api.get<{ success: boolean } & CoursesResponse>(
            "/courses",
        );
        return { data: data.data, meta: data.meta };
    },

    getCourseBySlug: async (
        slug: string,
        preview?: boolean,
    ): Promise<CourseDetail> => {
        const { data } = await api.get<{
            success: boolean;
            data: CourseDetail;
        }>(`/courses/${slug}`, {
            params: preview ? { preview: "true" } : undefined,
        });
        return data.data;
    },
};
