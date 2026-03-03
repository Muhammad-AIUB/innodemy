import type { AuthResponse } from "../../types/auth.types";

export interface LoginPayload {
    email: string;
    password: string;
}

export type LoginResponse = AuthResponse;
