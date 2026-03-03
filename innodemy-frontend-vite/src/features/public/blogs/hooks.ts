import { useQuery } from "@tanstack/react-query";
import { publicBlogsApi } from "./api";

export const usePublicBlogsQuery = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["publicBlogs", page, limit],
        queryFn: () => publicBlogsApi.getAll(page, limit),
        staleTime: 5 * 60_000,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const usePublicBlogDetailQuery = (slug: string) => {
    return useQuery({
        queryKey: ["publicBlog", slug],
        queryFn: () => publicBlogsApi.getBySlug(slug),
        staleTime: 10 * 60_000,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!slug,
    });
};
