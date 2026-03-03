export interface Course {
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

export interface CourseDetail extends Course {
    lessonsCount?: number;
}

export interface CoursesMeta {
    page: number;
    total: number;
    totalPages: number;
}

export interface CoursesResponse {
    data: Course[];
    meta: CoursesMeta;
}
