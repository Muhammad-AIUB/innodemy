/**
 * Admin Users Hooks
 * React Query hooks for user management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "./api";
import type { UsersListParams } from "./types";

const USERS_QUERY_KEY = ["admin", "users"];

/**
 * Fetch all users with optional filters
 */
export const useAdminUsersQuery = (params?: UsersListParams) => {
    return useQuery({
        queryKey: [...USERS_QUERY_KEY, params],
        queryFn: async () => {
            const response = await adminUsersApi.getUsers(params);
            return response.data;
        },
    });
};

/**
 * Promote a user to ADMIN role
 */
export const usePromoteToAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => adminUsersApi.promoteToAdmin(userId),
        onSuccess: () => {
            // Invalidate users list to refresh
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
};

/**
 * Delete an admin (deactivate)
 */
export const useDeleteAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => adminUsersApi.deleteAdmin(userId),
        onSuccess: () => {
            // Invalidate users list to refresh
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
};
