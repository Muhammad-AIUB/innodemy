import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useModulesQuery, useLessonDetailQuery } from "../hooks";
import LessonSidebar from "../components/LessonSidebar";
import LessonContent from "../components/LessonContent";
import {
    useCourseProgressQuery,
    useMarkLessonCompleteMutation,
} from "../../progress/hooks";
import useCourseCompletionEffect from "../../progress/hooks/useCourseCompletionEffect";
import isCourseCompleted from "../../progress/utils/isCourseCompleted";
import getNextLesson from "../utils/getNextLesson";
import { lessonsApi } from "../api";
import { useMyEnrollmentsQuery } from "../../enrollments/hooks";
import isEnrolledInCourse from "../../enrollments/utils/isEnrolledInCourse";

const LessonPage = () => {
    const { courseId, lessonId } = useParams<{
        courseId: string;
        lessonId: string;
    }>();
    const navigate = useNavigate();

    const safeCourseId = courseId ?? "";
    const safeLessonId = lessonId ?? "";

    const { data: enrollments, isLoading: enrollmentsLoading } =
        useMyEnrollmentsQuery();
    const isEnrolled = isEnrolledInCourse(safeCourseId, enrollments);

    // Redirect to course detail if not enrolled (uses cached data, no extra API call)
    useEffect(() => {
        if (enrollmentsLoading) return;
        if (!isEnrolled) {
            navigate(`/app/courses`, { replace: true });
        }
    }, [enrollmentsLoading, isEnrolled, navigate]);

    const queryClient = useQueryClient();

    const {
        data: modules,
        isLoading: modulesLoading,
        isError: modulesError,
    } = useModulesQuery(safeCourseId);

    const {
        data: lesson,
        isLoading: lessonLoading,
        isError: lessonError,
    } = useLessonDetailQuery(safeCourseId, safeLessonId);

    const { data: progress } = useCourseProgressQuery(safeCourseId);
    useCourseCompletionEffect(safeCourseId, progress);

    const markCompleteMutation = useMarkLessonCompleteMutation(safeCourseId);

    const nextLesson = useMemo(
        () => (modules ? getNextLesson(modules, safeLessonId) : null),
        [modules, safeLessonId],
    );

    const completedLessonIds = progress?.completedLessonIds ?? [];
    const isCompleted = completedLessonIds.includes(safeLessonId);
    const courseCompleted = isCourseCompleted(progress);

    // Stable ref to avoid effect re-runs in LessonContent when mutation object changes
    const markCompleteRef = useRef(markCompleteMutation);
    useEffect(() => {
        markCompleteRef.current = markCompleteMutation;
    });

    const handleAutoMarkComplete = useCallback(() => {
        const mutation = markCompleteRef.current;
        if (!safeLessonId || isCompleted || mutation.isPending) {
            return;
        }
        mutation.mutate(safeLessonId);
    }, [safeLessonId, isCompleted]);

    // Prefetch modules for the next lesson so navigation feels instant.
    // The modules query covers all lessons, so we just ensure it's warm.
    useEffect(() => {
        if (!nextLesson || !safeCourseId) return;

        queryClient.prefetchQuery({
            queryKey: ["modules", safeCourseId],
            queryFn: () => lessonsApi.getModulesByCourseId(safeCourseId),
        });
    }, [nextLesson, safeCourseId, queryClient]);

    if (modulesLoading || lessonLoading) {
        return <p className="p-6">Loading lesson...</p>;
    }

    if (modulesError || lessonError || !modules) {
        return (
            <p className="p-6 text-red-600">Failed to load lesson content.</p>
        );
    }

    if (!lesson) {
        return <p className="p-6 text-red-600">Lesson not found.</p>;
    }

    const progressPercentage = Math.min(
        100,
        Math.max(0, progress?.percentage ?? 0),
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b px-6 py-2">
                <span className="text-sm text-gray-600">
                    Progress: {progressPercentage}%
                </span>
                <div className="h-1.5 w-32 rounded-full bg-gray-200">
                    <div
                        className="h-1.5 rounded-full bg-black"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>
            {courseCompleted && (
                <div className="border-b bg-green-50 px-6 py-3 text-sm font-medium text-green-700">
                    🎉 You have completed this course!
                </div>
            )}
            <div className="flex min-h-0 flex-1">
                <LessonSidebar
                    modules={modules}
                    courseId={safeCourseId}
                    activeLessonId={safeLessonId}
                    completedLessonIds={completedLessonIds}
                />
                <LessonContent
                    lesson={lesson}
                    courseId={safeCourseId}
                    nextLesson={nextLesson}
                    isCompleted={isCompleted}
                    onMarkComplete={() =>
                        markCompleteMutation.mutate(safeLessonId)
                    }
                    isMarkingComplete={markCompleteMutation.isPending}
                    onAutoMarkComplete={handleAutoMarkComplete}
                />
            </div>
        </div>
    );
};

export default LessonPage;
