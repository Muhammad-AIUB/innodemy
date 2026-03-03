import api from "../../../api/axios";
import type { AdminWebinarRegistration } from "./types";

export const adminWebinarRegistrationsApi = {
    getByWebinar: async (
        webinarId: string,
    ): Promise<AdminWebinarRegistration[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: AdminWebinarRegistration[];
        }>(`/admin/webinars/${webinarId}/registrations`);
        return data.data;
    },
};
