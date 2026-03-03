export interface Category {
    id: string;
    name: string;
    slug: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateCategoryPayload {
    name: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
