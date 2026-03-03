import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "../types/auth.types";

interface AuthState {
    user: User | null;
    token: string | null;
    role: UserRole | null;
    hasHydrated: boolean;

    setAuth: (token: string, user: User) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            role: null,
            hasHydrated: false,

            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    role: user.role,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    role: null,
                }),

            setHasHydrated: (state) =>
                set({
                    hasHydrated: state,
                }),
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
