export interface AdminWebinar {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string | null;
    date: string;
    duration: number;
    time: string | null;
    instructorId: string | null;
    // Legacy fields (for backward compatibility)
    instructor: string | null;
    instructorImage: string | null;
    category: string | null;
    isUpcoming: boolean;
    sectionOneTitle: string | null;
    sectionOnePoints: string[];
    sectionTwoTitle: string | null;
    sectionTwoPoints: string[];
    status: "DRAFT" | "PUBLISHED";
    createdAt: string;
    updatedAt: string;
}

export interface CreateWebinarPayload {
    title: string;
    description: string;
    date: string;
    duration: number;
    image?: string;
    time?: string;
    instructorId?: string;
    // Legacy fields (for backward compatibility)
    instructor?: string;
    instructorImage?: string;
    category?: string;
    isUpcoming?: boolean;
    sectionOneTitle?: string;
    sectionOnePoints?: string[];
    sectionTwoTitle?: string;
    sectionTwoPoints?: string[];
}

export type UpdateWebinarPayload = Partial<CreateWebinarPayload>;
