import api from "../../../api/axios";
import type { Webinar, WebinarsResponse } from "./types";

export const webinarsApi = {
    getWebinars: async (): Promise<Webinar[]> => {
        const { data } = await api.get<{
            success: boolean;
        } & WebinarsResponse>("/webinars", {
            params: { limit: 100 },
        });
        return data.data;
    },

    getWebinarBySlug: async (slug: string): Promise<Webinar> => {
        const { data } = await api.get<{
            success: boolean;
            data: Webinar;
        }>(`/webinars/${slug}`);
        return data.data;
    },
};
