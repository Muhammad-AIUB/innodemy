export interface Instructor {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
}

export interface CreateInstructorPayload {
    name: string;
    image?: string;
    bio?: string;
}

export type UpdateInstructorPayload = Partial<CreateInstructorPayload>;
