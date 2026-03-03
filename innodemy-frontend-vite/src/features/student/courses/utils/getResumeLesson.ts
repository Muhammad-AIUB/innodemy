import type { CourseModule, Lesson } from "../../lessons/types";

const getResumeLesson = (
    modules: CourseModule[],
    completedLessonIds: string[],
): Lesson | null => {
    const completedSet = new Set(completedLessonIds);

    for (const module of modules) {
        for (const lesson of module.lessons) {
            if (!completedSet.has(lesson.id)) {
                return lesson;
            }
        }
    }

    return null;
};

export default getResumeLesson;
