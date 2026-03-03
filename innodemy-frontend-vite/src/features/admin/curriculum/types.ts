/**
 * Curriculum domain types — aligned with backend response shape.
 *
 * Backend contract:
 *   GET  /api/v1/courses/:courseId/modules
 *   POST /api/v1/courses/:courseId/modules  { title }
 *   PATCH /api/v1/modules/:id              { title? }
 *   DELETE /api/v1/modules/:id
 *   PATCH /api/v1/modules/:id/reorder      { direction }
 *
 *   POST /api/v1/modules/:moduleId/lessons { title, type, videoUrl? }
 *   PATCH /api/v1/lessons/:id              { title?, type?, videoUrl? }
 *   DELETE /api/v1/lessons/:id
 *   PATCH /api/v1/lessons/:id/reorder      { direction }
 */

export type LessonType = "VIDEO" | "QUIZ" | "ASSIGNMENT";

export type ReorderDirection = "up" | "down";

export type LessonContentBlock =
    | { type: "text"; value: string }
    | { type: "video"; url: string }
    | { type: "resource"; url: string; label: string };

export interface Lesson {
    id: string;
    title: string;
    order: number;
    type: LessonType;
    videoUrl: string | null;
    moduleId: string;
    content?: LessonContentBlock[] | null;
}

export interface Module {
    id: string;
    title: string;
    order: number;
    courseId: string;
    lessons: Lesson[];
}

/** POST /api/v1/courses/:courseId/modules */
export interface CreateModulePayload {
    title: string;
}

/** PATCH /api/v1/modules/:id */
export interface UpdateModulePayload {
    title?: string;
}

/** POST /api/v1/modules/:moduleId/lessons */
export interface CreateLessonPayload {
    title: string;
    type: LessonType;
    videoUrl?: string;
    quizTitle?: string;
    assignmentTitle?: string;
    assignmentDescription?: string;
    content?: LessonContentBlock[];
}

/** PATCH /api/v1/lessons/:id */
export interface UpdateLessonPayload {
    title?: string;
    type?: LessonType;
    videoUrl?: string;
    content?: LessonContentBlock[];
}
