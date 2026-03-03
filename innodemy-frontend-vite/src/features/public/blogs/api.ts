import api from "../../../api/axios";
import type { PaginatedBlogsResponse, PublicBlogDetail } from "./types";

export const publicBlogsApi = {
    getAll: async (
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedBlogsResponse> => {
        const { data } = await api.get<{
            success: boolean;
            data: PaginatedBlogsResponse;
        }>("/blogs", {
            params: { page, limit },
        });
        return data.data; // Unwrap envelope
    },

    getBySlug: async (slug: string): Promise<PublicBlogDetail> => {
        const { data } = await api.get<{
            success: boolean;
            data: PublicBlogDetail;
        }>(`/blogs/${slug}`);
        return data.data; // Unwrap envelope
    },
};
