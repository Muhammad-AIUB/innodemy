import api from "../../../api/axios";
import type {
    Category,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "./types";

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: Category[];
        }>("/categories");
        return data.data;
    },

    getOne: async (id: string): Promise<Category> => {
        const { data } = await api.get<{
            success: boolean;
            data: Category;
        }>(`/categories/${id}`);
        return data.data;
    },

    create: async (payload: CreateCategoryPayload): Promise<Category> => {
        const { data } = await api.post<{
            success: boolean;
            data: Category;
        }>("/categories", payload);
        return data.data;
    },

    update: async (
        id: string,
        payload: UpdateCategoryPayload,
    ): Promise<Category> => {
        const { data } = await api.patch<{
            success: boolean;
            data: Category;
        }>(`/categories/${id}`, payload);
        return data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },
};
