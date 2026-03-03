import api from "../../../api/axios";
import type {
    Instructor,
    CreateInstructorPayload,
    UpdateInstructorPayload,
} from "./types";

export const instructorsApi = {
    getAll: async (): Promise<Instructor[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: Instructor[];
        }>("/instructors");
        return data.data;
    },

    getOne: async (id: string): Promise<Instructor> => {
        const { data } = await api.get<{
            success: boolean;
            data: Instructor;
        }>(`/instructors/${id}`);
        return data.data;
    },

    create: async (payload: CreateInstructorPayload): Promise<Instructor> => {
        const { data } = await api.post<{
            success: boolean;
            data: Instructor;
        }>("/instructors", payload);
        return data.data;
    },

    update: async (
        id: string,
        payload: UpdateInstructorPayload,
    ): Promise<Instructor> => {
        const { data } = await api.patch<{
            success: boolean;
            data: Instructor;
        }>(`/instructors/${id}`, payload);
        return data.data;
    },

    toggleStatus: async (id: string): Promise<Instructor> => {
        const { data } = await api.patch<{
            success: boolean;
            data: Instructor;
        }>(`/instructors/${id}/toggle-status`);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/instructors/${id}`);
    },
};
