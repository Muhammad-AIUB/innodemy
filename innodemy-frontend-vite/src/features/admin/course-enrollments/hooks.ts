import { useQuery } from "@tanstack/react-query";
import { getCourseEnrollments } from "./api";

export const useCourseEnrollmentsQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["courseEnrollments", courseId],
        queryFn: () => getCourseEnrollments(courseId),
        enabled: !!courseId,
        retry: false,
        refetchOnWindowFocus: false,
    });
};
