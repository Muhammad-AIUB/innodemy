import type { Course } from "../../courses/types";
import getResumeLesson from "../../courses/utils/getResumeLesson";
import type { CourseModule } from "../../lessons/types";
import type { CourseProgressResponse } from "../types";
import isCourseCompleted from "./isCourseCompleted";

interface GlobalResumeTarget {
    courseId: string;
    lessonId: string;
}

const getGlobalResumeTarget = (
    courses: Course[],
    getProgressByCourseId: (
        courseId: string,
    ) => CourseProgressResponse | undefined,
    getModulesByCourseId: (courseId: string) => CourseModule[] | undefined,
): GlobalResumeTarget | null => {
    for (const course of courses) {
        const progress = getProgressByCourseId(course.id);
        if (!progress || isCourseCompleted(progress)) {
            continue;
        }

        const modules = getModulesByCourseId(course.id);
        if (!modules || modules.length === 0) {
            continue;
        }

        const resumeLesson = getResumeLesson(modules, progress.completedLessonIds);
        if (!resumeLesson) {
            continue;
        }

        return { courseId: course.id, lessonId: resumeLesson.id };
    }

    return null;
};

export default getGlobalResumeTarget;
