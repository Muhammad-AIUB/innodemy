import { Navigate, Outlet } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { UserRole } from "../types/auth.types";
import { SESSION_QUERY_KEY } from "../features/auth/session";

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
}

const roleRedirectMap: Record<UserRole, string> = {
    [UserRole.STUDENT]: "/app/dashboard",
    [UserRole.ADMIN]: "/admin/dashboard",
    [UserRole.SUPER_ADMIN]: "/super-admin/dashboard",
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { token, role, hasHydrated } = useAuthStore();
    const isSessionLoading = useIsFetching({ queryKey: SESSION_QUERY_KEY }) > 0;

    // Wait for Zustand persist to rehydrate state from localStorage
    if (!hasHydrated) {
        return null;
    }

    // While the session is being hydrated (GET /auth/me in-flight),
    // render nothing to prevent a premature redirect to login.
    if (token && isSessionLoading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (role && !allowedRoles.includes(role)) {
        return <Navigate to={roleRedirectMap[role]} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
