import type { CourseProgressResponse } from "../types";

const isCourseCompleted = (
    progress?: CourseProgressResponse | null,
): boolean => {
    if (!progress || progress.totalLessons <= 0) {
        return false;
    }

    return progress.completedLessons === progress.totalLessons;
};

export default isCourseCompleted;
