import api from "../../../api/axios";
import type { CourseModule } from "./types";

export const lessonsApi = {
    getModulesByCourseId: async (courseId: string): Promise<CourseModule[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: CourseModule[];
        }>(`/courses/${courseId}/modules`);
        return data.data;
    },
};
