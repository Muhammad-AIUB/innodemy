import { useQuery } from "@tanstack/react-query";
import { publicCoursesApi } from "./api";

export const usePublicCoursesQuery = () => {
    return useQuery({
        queryKey: ["publicCourses"],
        queryFn: publicCoursesApi.getCourses,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60_000,
    });
};

export const usePublicCourseDetailQuery = (slug: string) => {
    return useQuery({
        queryKey: ["publicCourse", slug],
        queryFn: () => publicCoursesApi.getCourseBySlug(slug),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!slug,
    });
};

/** Fetch visible public content sections for a course */
export const usePublicCourseSectionsQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["publicCourseSections", courseId],
        queryFn: () => publicCoursesApi.getPublicSections(courseId),
        enabled: !!courseId,
        staleTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });
};
