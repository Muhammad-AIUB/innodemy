/** Section types matching the backend CoursePublicSectionType enum */
export type CoursePublicSectionType =
    | "HERO"
    | "MODULES"
    | "INSTRUCTORS"
    | "FEATURES"
    | "PROJECTS"
    | "TARGET_AUDIENCE"
    | "PREREQUISITES"
    | "FAQ"
    | "CUSTOM";

/** A single public content section as returned by the API */
export interface CoursePublicSection {
    id: string;
    courseId: string;
    type: CoursePublicSectionType;
    title: string | null;
    subtitle: string | null;
    order: number;
    content: unknown[];
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}

/** Payload to create a new section */
export interface CreateSectionPayload {
    type: CoursePublicSectionType;
    title?: string;
    subtitle?: string;
    order?: number;
    content?: unknown[];
    isVisible?: boolean;
}

/** Payload to update an existing section */
export interface UpdateSectionPayload {
    title?: string;
    subtitle?: string;
    order?: number;
    content?: unknown[];
    isVisible?: boolean;
}

/** Human-readable labels for each section type */
export const SECTION_TYPE_LABELS: Record<CoursePublicSectionType, string> = {
    HERO: "Hero Banner",
    MODULES: "Course Modules",
    INSTRUCTORS: "Instructors & Mentors",
    FEATURES: "What You Will Get",
    PROJECTS: "Projects You Will Build",
    TARGET_AUDIENCE: "Who This Course Is For",
    PREREQUISITES: "What You Will Need",
    FAQ: "FAQ",
    CUSTOM: "Custom Section",
};

/** All available section types, in default display order */
export const SECTION_TYPES: CoursePublicSectionType[] = [
    "HERO",
    "MODULES",
    "INSTRUCTORS",
    "FEATURES",
    "PROJECTS",
    "TARGET_AUDIENCE",
    "PREREQUISITES",
    "FAQ",
    "CUSTOM",
];
