import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminBlogsApi, type CreateBlogPayload, type UpdateBlogPayload } from "./api";

export const useAdminBlogsQuery = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["adminBlogs", page, limit],
        queryFn: () => adminBlogsApi.getAll(page, limit),
        retry: false,
    });
};

export const useAdminBlogDetailQuery = (id: string) => {
    return useQuery({
        queryKey: ["adminBlog", id],
        queryFn: () => adminBlogsApi.getById(id),
        retry: false,
        enabled: !!id,
    });
};

export const useCreateBlogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBlogPayload) => adminBlogsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
            queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
        },
    });
};

export const useUpdateBlogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateBlogPayload;
        }) => adminBlogsApi.update({ id, payload }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
            queryClient.invalidateQueries({
                queryKey: ["adminBlog", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
        },
    });
};

export const usePublishBlogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminBlogsApi.publish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
            queryClient.invalidateQueries({ queryKey: ["adminBlog", id] });
            queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
        },
    });
};

export const useDeleteBlogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminBlogsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
            queryClient.invalidateQueries({ queryKey: ["publicBlogs"] });
        },
    });
};
