export interface LessonProgress {
    lessonId: string;
    completed: boolean;
}

export interface CourseProgress {
    courseId: string;
    completedLessonIds: string[];
    percentage: number;
}

/** Backend GET /progress/:courseId response shape */
export interface CourseProgressResponse {
    courseId: string;
    completedLessons: number;
    totalLessons: number;
    percentage: number;
    completedLessonIds: string[];
}

/** Backend POST /progress/complete response shape */
export interface MarkLessonCompleteResponse {
    lessonId: string;
    completed: boolean;
    lastWatchedAt: string;
}
