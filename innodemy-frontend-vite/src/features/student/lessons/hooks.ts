import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { lessonsApi } from "./api";
import type { Lesson } from "./types";

export const useModulesQuery = (courseId: string) => {
    return useQuery({
        queryKey: ["modules", courseId],
        queryFn: () => lessonsApi.getModulesByCourseId(courseId),
        enabled: !!courseId,
    });
};

export const useLessonDetailQuery = (courseId: string, lessonId: string) => {
    const { data: modules, isLoading, isError } = useModulesQuery(courseId);

    const lesson = useMemo<Lesson | undefined>(() => {
        if (!modules) return undefined;
        for (const mod of modules) {
            const found = mod.lessons.find((l) => l.id === lessonId);
            if (found) return found;
        }
        return undefined;
    }, [modules, lessonId]);

    return { data: lesson, isLoading, isError };
};
