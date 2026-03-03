import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import { authApi } from "./api";
import type { LoginPayload } from "./types";

/**
 * Global API Error Normalization
 *
 * The axios response interceptor (src/api/axios.ts) converts every
 * API failure into an `AppError` before it reaches React Query.
 *
 * This means the `error` field returned by any query or mutation
 * is already normalized:
 *
 *   const { error } = useLoginMutation();
 *   // error: AppError | null
 *   //  → { message: string; status?: number; code?: string }
 *
 * Components can safely display `error.message` without parsing
 * AxiosError internals. For a convenience helper see:
 *   src/hooks/useApiError.ts → useApiError().getErrorMessage(error)
 */
export const useLoginMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),
        onSuccess: (data) => {
            setAuth(data.accessToken, data.user);
        },
        retry: false,
    });
};
