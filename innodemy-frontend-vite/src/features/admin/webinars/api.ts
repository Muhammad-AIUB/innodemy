import api from "../../../api/axios";
import type {
    AdminWebinar,
    CreateWebinarPayload,
    UpdateWebinarPayload,
} from "./types";

export const adminWebinarsApi = {
    getAll: async (): Promise<AdminWebinar[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: AdminWebinar[];
            meta: { page: number; total: number; totalPages: number };
        }>("/admin/webinars", { params: { limit: 100 } });
        return data.data;
    },

    getOne: async (id: string): Promise<AdminWebinar> => {
        const { data } = await api.get<{
            success: boolean;
            data: AdminWebinar;
        }>(`/admin/webinars/${id}`);
        return data.data;
    },

    create: async (payload: CreateWebinarPayload): Promise<AdminWebinar> => {
        const { data } = await api.post<{
            success: boolean;
            data: AdminWebinar;
        }>("/admin/webinars", payload);
        return data.data;
    },

    update: async (
        id: string,
        payload: UpdateWebinarPayload,
    ): Promise<AdminWebinar> => {
        const { data } = await api.patch<{
            success: boolean;
            data: AdminWebinar;
        }>(`/admin/webinars/${id}`, payload);
        return data.data;
    },

    publish: async (id: string): Promise<AdminWebinar> => {
        const { data } = await api.patch<{
            success: boolean;
            data: AdminWebinar;
        }>(`/admin/webinars/${id}/publish`);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/webinars/${id}`);
    },
};
