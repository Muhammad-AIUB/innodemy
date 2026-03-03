import api from "../../../api/axios";
import type { StudentEnrollment } from "./types";

export const enrollmentsApi = {
    getMyEnrollments: async (): Promise<StudentEnrollment[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: StudentEnrollment[];
        }>("/enrollments/my-courses");
        return data.data;
    },
};
