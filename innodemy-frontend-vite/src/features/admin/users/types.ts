import type { User } from "../../../types/auth.types";

export interface UsersListResponse {
    users: User[];
    page: number;
    limit: number;
    total: number;
    role?: string;
    sortBy: string;
    order: "asc" | "desc";
    isActive?: string;
    isDeleted?: string;
}

export interface UsersListParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    isActive?: string;
    isDeleted?: string;
}

export interface PromoteUserResponse {
    user: User;
}

export interface DeleteAdminResponse {
    message: string;
}
