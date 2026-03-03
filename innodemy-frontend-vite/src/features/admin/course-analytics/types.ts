export interface CourseAnalytics {
    enrolledStudents: number;
    startedStudents: number;
    completedStudents: number;
    completionRate: number;
}

export interface LessonEngagement {
    lessonId: string;
    title: string;
    completionRate: number;
}

export interface ModuleLessonEngagement {
    moduleId: string;
    moduleTitle: string;
    lessons: LessonEngagement[];
}
