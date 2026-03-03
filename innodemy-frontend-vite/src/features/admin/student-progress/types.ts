export interface LessonProgressItem {
    lessonId: string;
    title: string;
    completed: boolean;
}

export interface ModuleProgress {
    moduleId: string;
    title: string;
    lessons: LessonProgressItem[];
}

export interface StudentCourseProgress {
    userId: string;
    name: string;
    email: string;
    modules: ModuleProgress[];
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
}
