import { useQuery } from "@tanstack/react-query";
import { getStudentCourseProgress } from "./api";

export const useStudentCourseProgressQuery = (
    courseId: string,
    userId: string,
) => {
    return useQuery({
        queryKey: ["studentCourseProgress", courseId, userId],
        queryFn: () => getStudentCourseProgress(courseId, userId),
        enabled: !!courseId && !!userId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};
