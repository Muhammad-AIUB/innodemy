export interface Webinar {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    date: string;
    duration: number;
    time: string;
    instructor: string;
    instructorImage: string;
    category: string;
    sectionOneTitle: string;
    sectionOnePoints: string[];
    sectionTwoTitle: string;
    sectionTwoPoints: string[];
}

export interface WebinarsMeta {
    page: number;
    total: number;
    totalPages: number;
}

export interface WebinarsResponse {
    data: Webinar[];
    meta: WebinarsMeta;
}
