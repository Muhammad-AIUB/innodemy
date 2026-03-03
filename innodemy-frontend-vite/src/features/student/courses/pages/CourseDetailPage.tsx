import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCourseDetailQuery } from "../hooks";
import CourseHero from "../components/CourseHero";
import { useModulesQuery } from "../../lessons/hooks";
import { useCourseProgressQuery } from "../../progress/hooks";
import getResumeLesson from "../utils/getResumeLesson";
import isCourseCompleted from "../../progress/utils/isCourseCompleted";
import EnrollmentRequestDrawer from "../../enrollment-requests/components/EnrollmentRequestDrawer";
import { useMyEnrollmentsQuery } from "../../enrollments/hooks";
import isEnrolledInCourse from "../../enrollments/utils/isEnrolledInCourse";

const CourseDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const preview = searchParams.get("preview") === "true";
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        data: course,
        isLoading,
        isError,
    } = useCourseDetailQuery(slug ?? "", preview || undefined);

    const courseId = course?.id ?? "";

    const { data: enrollments } = useMyEnrollmentsQuery();
    const isEnrolled = isEnrolledInCourse(courseId, enrollments);

    const {
        data: modules,
        isLoading: modulesLoading,
        isError: modulesError,
    } = useModulesQuery(courseId);
    const {
        data: progress,
        isLoading: progressLoading,
        isError: progressError,
    } = useCourseProgressQuery(isEnrolled ? courseId : "");
    const courseCompleted = isCourseCompleted(progress);

    const firstLesson = useMemo(() => {
        if (!modules) return null;

        for (const module of modules) {
            if (module.lessons.length > 0) {
                return module.lessons[0];
            }
        }

        return null;
    }, [modules]);

    const resumeLesson = useMemo(() => {
        if (!modules) return null;
        if (courseCompleted) return null;
        return getResumeLesson(modules, progress?.completedLessonIds ?? []);
    }, [modules, progress?.completedLessonIds, courseCompleted]);

    const targetLesson = resumeLesson ?? firstLesson;
    const isResolvingResume = modulesLoading || progressLoading;
    const isStartingDisabled =
        !courseId ||
        isResolvingResume ||
        !targetLesson ||
        modulesError ||
        progressError;

    const handleStartLearning = useCallback(() => {
        if (!courseId || !targetLesson || isResolvingResume) {
            return;
        }

        navigate(`/app/courses/${courseId}/lessons/${targetLesson.id}`);
    }, [courseId, targetLesson, isResolvingResume, navigate]);

    if (isLoading) {
        return <p>Loading course...</p>;
    }

    if (isError || !course) {
        return <p className="text-red-600">Failed to load course.</p>;
    }

    return (
        <div>
            <CourseHero
                course={course}
                onStartLearning={handleStartLearning}
                isStartingDisabled={isStartingDisabled}
                isResolvingResume={isResolvingResume}
                progress={isEnrolled ? progress : undefined}
                isEnrolled={isEnrolled}
            />

            {/* Enroll Now — visible only when NOT enrolled */}
            {!isEnrolled && (
                <div className="mt-4 px-6">
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Enroll Now
                    </button>
                </div>
            )}

            <EnrollmentRequestDrawer
                courseId={courseId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default CourseDetailPage;
