import api from "../../api/axios";
import type { LoginPayload, LoginResponse } from "./types";

export const authApi = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: LoginResponse;
        }>("/auth/login", payload);
        return data.data;
    },
};
