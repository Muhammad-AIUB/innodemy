import api from "../../../api/axios";
import type { StudentCourseProgress } from "./types";

export const getStudentCourseProgress = async (
    courseId: string,
    userId: string,
): Promise<StudentCourseProgress> => {
    const { data } = await api.get<{
        success: boolean;
        data: StudentCourseProgress;
    }>(`/admin/courses/${courseId}/students/${userId}/progress`);

    return data.data;
};
