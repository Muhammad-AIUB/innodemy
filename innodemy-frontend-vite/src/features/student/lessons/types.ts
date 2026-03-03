export const LessonType = {
    VIDEO: "VIDEO",
    QUIZ: "QUIZ",
    ASSIGNMENT: "ASSIGNMENT",
} as const;

export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export type LessonContentBlock =
    | { type: "text"; value: string }
    | { type: "video"; url: string }
    | { type: "resource"; url: string; label: string };

export interface Lesson {
    id: string;
    title: string;
    type: LessonType;
    videoUrl: string | null;
    moduleId: string;
    content?: LessonContentBlock[] | null;
}

export interface LessonDetail extends Lesson {
    content?: LessonContentBlock[] | null;
}

export interface CourseModule {
    id: string;
    title: string;
    courseId: string;
    lessons: Lesson[];
}
