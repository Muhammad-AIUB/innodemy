import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "./api";

export const useCoursesQuery = () => {
    return useQuery({
        queryKey: ["courses"],
        queryFn: coursesApi.getCourses,
    });
};

export const useCourseDetailQuery = (slug: string, preview?: boolean) => {
    return useQuery({
        queryKey: ["course", slug, preview ?? false],
        queryFn: () => coursesApi.getCourseBySlug(slug, preview),
        enabled: !!slug,
    });
};
