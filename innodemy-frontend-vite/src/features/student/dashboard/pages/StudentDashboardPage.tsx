import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCoursesQuery } from "../../courses/hooks";
import type { Course } from "../../courses/types";
import getResumeLesson from "../../courses/utils/getResumeLesson";
import type { CourseModule, Lesson } from "../../lessons/types";
import type { CourseProgressResponse } from "../../progress/types";
import isCourseCompleted from "../../progress/utils/isCourseCompleted";
import CompletedCourseCard from "../components/CompletedCourseCard";
import ContinueLearningCard from "../components/ContinueLearningCard";

const getFirstLesson = (modules: CourseModule[]): Lesson | null => {
    for (const module of modules) {
        if (module.lessons.length > 0) {
            return module.lessons[0];
        }
    }

    return null;
};

const StudentDashboardPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useCoursesQuery();

    const courses = useMemo(() => data?.data ?? [], [data]);

    const courseWithProgress = useMemo(() => {
        return courses.map((course) => ({
            course,
            progress: queryClient.getQueryData<CourseProgressResponse>([
                "progress",
                course.id,
            ]),
        }));
    }, [courses, queryClient]);

    const continueLearningCourses = useMemo(() => {
        return courseWithProgress.filter(
            (item) => item.progress && !isCourseCompleted(item.progress),
        );
    }, [courseWithProgress]);

    const completedCourses = useMemo(() => {
        return courseWithProgress.filter(
            (item) => item.progress && isCourseCompleted(item.progress),
        );
    }, [courseWithProgress]);

    const navigateToLesson = useCallback(
        (course: Course, lesson: Lesson | null) => {
            if (!lesson) {
                navigate(`/app/courses/${course.slug}`);
                return;
            }

            navigate(`/app/courses/${course.id}/lessons/${lesson.id}`);
        },
        [navigate],
    );

    const handleContinueLearning = useCallback(
        (course: Course, progress: CourseProgressResponse) => {
            const modules =
                queryClient.getQueryData<CourseModule[]>([
                    "modules",
                    course.id,
                ]) ?? [];
            const firstLesson = getFirstLesson(modules);

            if (modules.length === 0 || !firstLesson) {
                navigate(`/app/courses/${course.slug}`);
                return;
            }

            const resumeLesson = getResumeLesson(
                modules,
                progress.completedLessonIds,
            );

            navigateToLesson(course, resumeLesson ?? firstLesson);
        },
        [navigate, navigateToLesson, queryClient],
    );

    const handleReviewCourse = useCallback(
        (course: Course) => {
            const modules =
                queryClient.getQueryData<CourseModule[]>([
                    "modules",
                    course.id,
                ]) ?? [];
            const firstLesson = getFirstLesson(modules);

            navigateToLesson(course, firstLesson);
        },
        [navigateToLesson, queryClient],
    );

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (isError) {
        return <p className="text-red-600">Failed to load dashboard.</p>;
    }

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-2xl font-bold">Continue Learning</h1>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {continueLearningCourses.map(({ course, progress }) => {
                        if (!progress) return null;

                        return (
                            <ContinueLearningCard
                                key={course.id}
                                course={course}
                                progress={progress}
                                onContinueLearning={() =>
                                    handleContinueLearning(course, progress)
                                }
                            />
                        );
                    })}
                </div>
                {continueLearningCourses.length === 0 && (
                    <p className="mt-4 text-sm text-gray-600">
                        No courses in progress yet.
                    </p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold">Completed Courses</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {completedCourses.map(({ course }) => (
                        <CompletedCourseCard
                            key={course.id}
                            course={course}
                            onReviewCourse={() => handleReviewCourse(course)}
                            onViewCertificate={() =>
                                navigate(
                                    `/app/courses/${course.id}/certificate`,
                                )
                            }
                        />
                    ))}
                </div>
                {completedCourses.length === 0 && (
                    <p className="mt-4 text-sm text-gray-600">
                        Complete a course to see it here.
                    </p>
                )}
            </section>
        </div>
    );
};

export default StudentDashboardPage;
