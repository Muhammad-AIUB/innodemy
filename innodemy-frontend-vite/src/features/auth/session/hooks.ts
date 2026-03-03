import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/authStore";
import { sessionApi } from "./api";

export const SESSION_QUERY_KEY = ["session"] as const;

/**
 * Fetches the current user from GET /auth/me on app startup.
 *
 * Enabled only when a persisted token exists.
 * On success, restores the auth store (user + token) so the
 * session survives a page refresh without UI flicker.
 *
 * - retry: false       → don't retry on 401 (expired token)
 * - staleTime: Infinity → single fetch per session
 * - gcTime: Infinity    → never garbage-collect
 * - refetchOnWindowFocus / refetchOnReconnect: false → no polling
 */
export const useSessionQuery = () => {
    const token = useAuthStore((s) => s.token);
    const setAuth = useAuthStore((s) => s.setAuth);
    const logout = useAuthStore((s) => s.logout);

    const query = useQuery({
        queryKey: SESSION_QUERY_KEY,
        queryFn: sessionApi.getCurrentUser,
        enabled: !!token,
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    // Sync auth store when session data arrives
    useEffect(() => {
        if (query.data && token) {
            setAuth(token, query.data);
        }
    }, [query.data, token, setAuth]);

    // Clear auth store on session fetch failure (e.g. expired token)
    useEffect(() => {
        if (query.isError) {
            logout();
        }
    }, [query.isError, logout]);

    return query;
};
