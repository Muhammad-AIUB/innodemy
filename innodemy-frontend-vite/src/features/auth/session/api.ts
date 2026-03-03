import api from "../../../api/axios";
import type { User } from "../../../types/auth.types";

interface GetMeResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export const sessionApi = {
    getCurrentUser: async (): Promise<User> => {
        const { data } = await api.get<GetMeResponse>("/auth/me");
        return data.data.user;
    },
};
