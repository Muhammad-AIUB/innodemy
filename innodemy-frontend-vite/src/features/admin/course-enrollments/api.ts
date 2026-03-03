import api from "../../../api/axios";
import type { CourseEnrollment } from "./types";

export const getCourseEnrollments = async (
    courseId: string,
): Promise<CourseEnrollment[]> => {
    const { data } = await api.get<{
        success: boolean;
        data: CourseEnrollment[];
    }>(`/admin/courses/${courseId}/enrollments`);

    return data.data;
};
