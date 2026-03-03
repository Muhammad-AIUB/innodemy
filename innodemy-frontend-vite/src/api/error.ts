import { AxiosError } from "axios";

/**
 * Normalized application error shape.
 *
 * Every API error surfaced to components and React Query hooks
 * will conform to this interface. Raw AxiosError objects never
 * reach the UI layer.
 */
export interface AppError {
    message: string;
    status?: number;
    code?: string;
}

/**
 * Shape of the standard backend error response.
 *
 * The backend returns `{ success: false, message: "..." }` on failure.
 * Additional fields (statusCode, error) may also be present.
 */
interface BackendErrorResponse {
    success?: boolean;
    message?: string;
    statusCode?: number;
    error?: string;
}

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";

/**
 * Converts any thrown value into a predictable `AppError`.
 *
 * Priority:
 *  1. Backend response body `message`
 *  2. Axios-level `error.message`
 *  3. Generic fallback
 */
export function normalizeApiError(error: unknown): AppError {
    if (isAxiosError(error)) {
        const data = error.response?.data as BackendErrorResponse | undefined;

        return {
            message: data?.message ?? error.message ?? DEFAULT_ERROR_MESSAGE,
            status: error.response?.status,
            code: error.code,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message || DEFAULT_ERROR_MESSAGE,
        };
    }

    return {
        message: DEFAULT_ERROR_MESSAGE,
    };
}

/**
 * Type-safe check for AxiosError without importing isAxiosError
 * from axios (avoids bundling issues in edge cases).
 */
function isAxiosError(error: unknown): error is AxiosError {
    return (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as AxiosError).isAxiosError === true
    );
}
