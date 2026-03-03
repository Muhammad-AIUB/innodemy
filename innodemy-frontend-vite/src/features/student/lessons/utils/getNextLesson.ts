import type { CourseModule, Lesson } from "../types";

/**
 * Returns the next lesson in module order, or null if the current lesson
 * is the last one in the course.
 *
 * Traversal order:
 *   1. Remaining lessons in the current module
 *   2. First lesson of the next module
 *   3. null when the course is exhausted
 *
 * Pure function — no React dependencies.
 */
const getNextLesson = (
    modules: CourseModule[],
    currentLessonId: string,
): Lesson | null => {
    for (let mi = 0; mi < modules.length; mi++) {
        const lessons = modules[mi].lessons;

        for (let li = 0; li < lessons.length; li++) {
            if (lessons[li].id !== currentLessonId) continue;

            // Next lesson in the same module
            if (li + 1 < lessons.length) {
                return lessons[li + 1];
            }

            // First lesson of the next module
            if (mi + 1 < modules.length) {
                const nextModuleLessons = modules[mi + 1].lessons;
                if (nextModuleLessons.length > 0) {
                    return nextModuleLessons[0];
                }
            }

            // End of course
            return null;
        }
    }

    // currentLessonId not found in any module
    return null;
};

export default getNextLesson;
