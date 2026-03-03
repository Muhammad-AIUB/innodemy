import api from "../../../api/axios";
import type { AdminBlog, PaginatedAdminBlogsResponse } from "./types";
import type { BlogContentBlock } from "../../shared/types/blog-content-block.types";

export interface CreateBlogPayload {
    title: string;
    excerpt?: string;
    content: string;
    contentBlocks?: BlogContentBlock[];
    bannerImage?: string;
    authorId: string;
    categoryId?: string;
    tagIds?: string[];
    readDuration?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
}

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export const adminBlogsApi = {
    getAll: async (
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedAdminBlogsResponse> => {
        const { data } = await api.get<{
            success: boolean;
            data: PaginatedAdminBlogsResponse;
        }>("/admin/blogs", {
            params: { page, limit },
        });
        return data.data; // Unwrap envelope
    },

    getById: async (id: string): Promise<AdminBlog> => {
        const { data } = await api.get<{
            success: boolean;
            data: AdminBlog;
        }>(`/admin/blogs/${id}`);
        return data.data; // Unwrap envelope
    },

    create: async (payload: CreateBlogPayload): Promise<AdminBlog> => {
        const { data } = await api.post<{ success: boolean; data: AdminBlog }>(
            "/admin/blogs",
            payload,
        );
        return data.data; // Unwrap envelope
    },

    update: async ({
        id,
        payload,
    }: {
        id: string;
        payload: UpdateBlogPayload;
    }): Promise<AdminBlog> => {
        const { data } = await api.patch<{ success: boolean; data: AdminBlog }>(
            `/admin/blogs/${id}`,
            payload,
        );
        return data.data; // Unwrap envelope
    },

    publish: async (id: string): Promise<AdminBlog> => {
        const { data } = await api.patch<{ success: boolean; data: AdminBlog }>(
            `/admin/blogs/${id}/publish`,
            {},
        );
        return data.data; // Unwrap envelope
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/blogs/${id}`);
    },
};
