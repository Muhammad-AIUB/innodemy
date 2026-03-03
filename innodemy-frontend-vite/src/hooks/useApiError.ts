import type { AppError } from "../api/error";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/**
 * Utility hook that provides helpers for safely extracting
 * user-facing messages from normalized API errors.
 *
 * Usage inside a component:
 *
 * ```tsx
 * const { getErrorMessage } = useApiError();
 * const { error } = useSomeQuery();
 *
 * return error ? <p>{getErrorMessage(error)}</p> : null;
 * ```
 *
 * The error parameter is typed as `unknown` so it works seamlessly
 * with TanStack Query's default error type. Internally it checks
 * for the `AppError` shape produced by the axios response interceptor.
 */
export const useApiError = () => {
    /**
     * Extract a safe, user-facing message from a query/mutation error.
     *
     * Because the axios interceptor already normalizes errors into
     * `AppError`, this function simply reads `.message`. It falls
     * back gracefully when the error shape is unexpected.
     */
    const getErrorMessage = (error: unknown): string => {
        if (isAppError(error)) {
            return error.message;
        }

        if (error instanceof Error) {
            return error.message || FALLBACK_MESSAGE;
        }

        return FALLBACK_MESSAGE;
    };

    return { getErrorMessage } as const;
};

/**
 * Type guard for the normalized AppError shape.
 */
function isAppError(error: unknown): error is AppError {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as AppError).message === "string"
    );
}
