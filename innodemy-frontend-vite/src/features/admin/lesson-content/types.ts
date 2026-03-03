export type LessonType = "VIDEO" | "QUIZ" | "ASSIGNMENT";

export type LessonContentBlock =
    | { type: "text"; value: string }
    | { type: "video"; url: string }
    | { type: "resource"; url: string; label: string };

export interface AdminLessonContent {
    id: string;
    title: string;
    order: number;
    type: LessonType;
    videoUrl: string | null;
    moduleId: string;
    courseId: string;
    content?: LessonContentBlock[] | null;
}

export interface UpdateLessonContentPayload {
    content?: LessonContentBlock[];
}
