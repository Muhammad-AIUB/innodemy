import api from "../../../api/axios";
import type { ApiResponse } from "../../../types/api.types";
import type { AllRegistrationsResponse, AllRegistrationsParams } from "./types";

export const allRegistrationsApi = {
    getAll: async (
        params?: AllRegistrationsParams,
    ): Promise<AllRegistrationsResponse> => {
        const { data } = await api.get<ApiResponse<AllRegistrationsResponse>>(
            "/admin/webinars/registrations",
            { params },
        );
        return data.data;
    },
};
