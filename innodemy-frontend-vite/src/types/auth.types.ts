export const UserRole = {
    STUDENT: "STUDENT",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AuthProvider = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
} as const;

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export interface User {
    id: string;
    name: string | null;
    email: string;
    phoneNumber: string | null;
    role: UserRole;
    provider: AuthProvider;
    isVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}
