export interface PublicCourse {
    id: string;
    title: string;
    slug: string;
    description: string;
    bannerImage: string;
    price: number;
    discountPrice: number | null;
    duration: number;
    startDate: string;
    classDays: string;
    classTime: string;
    totalModules: number;
    totalProjects: number;
    totalLive: number;
}

export interface PublicCoursesMeta {
    page: number;
    total: number;
    totalPages: number;
}

export interface PublicCoursesResponse {
    data: PublicCourse[];
    meta: PublicCoursesMeta;
}

/** Section types matching backend CoursePublicSectionType */
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

/** A visible public content section */
export interface CoursePublicSection {
    id: string;
    courseId: string;
    type: CoursePublicSectionType;
    title: string | null;
    subtitle: string | null;
    order: number;
    content: Record<string, unknown>[];
    isVisible: boolean;
}
