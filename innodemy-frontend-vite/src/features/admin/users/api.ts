/**
 * Admin Users API
 * All user management endpoints for SUPER_ADMIN role
 */

import axios from "../../../api/axios";
import type { ApiResponse } from "../../../types/api.types";
import type {
    UsersListResponse,
    UsersListParams,
    PromoteUserResponse,
    DeleteAdminResponse,
} from "./types";

export const adminUsersApi = {
    /**
     * Get all users with pagination and filters
     * GET /auth/users
     */
    async getUsers(
        params?: UsersListParams,
    ): Promise<ApiResponse<UsersListResponse>> {
        const { data } = await axios.get<ApiResponse<UsersListResponse>>(
            "/auth/users",
            { params },
        );
        return data;
    },

    /**
     * Promote a user to ADMIN role
     * POST /auth/users/:id/promote-admin
     */
    async promoteToAdmin(
        userId: string,
    ): Promise<ApiResponse<PromoteUserResponse>> {
        const { data } = await axios.post<ApiResponse<PromoteUserResponse>>(
            `/auth/users/${userId}/promote-admin`,
        );
        return data;
    },

    /**
     * Delete an admin (soft delete / deactivate)
     * DELETE /auth/admins/:id
     */
    async deleteAdmin(
        userId: string,
    ): Promise<ApiResponse<DeleteAdminResponse>> {
        const { data } = await axios.delete<ApiResponse<DeleteAdminResponse>>(
            `/auth/admins/${userId}`,
        );
        return data;
    },
};
