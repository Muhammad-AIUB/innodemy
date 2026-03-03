import type { ReactNode } from "react";
import { useSessionQuery } from "./hooks";

interface SessionProviderProps {
    children: ReactNode;
}

/**
 * Runs session hydration once at app startup.
 *
 * - Reads the persisted token from authStore
 * - Fires GET /auth/me to validate the token and fetch the current user
 * - Renders nothing of its own — purely a bootstrap wrapper
 * - Children render immediately (no blocking); ProtectedRoute
 *   handles the loading state to prevent redirect flicker.
 */
const SessionProvider = ({ children }: SessionProviderProps) => {
    useSessionQuery();
    return <>{children}</>;
};

export default SessionProvider;
