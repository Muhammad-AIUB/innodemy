import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminWebinarsApi } from "./api";
import type { CreateWebinarPayload, UpdateWebinarPayload } from "./types";

export const useAdminWebinarsQuery = () => {
    return useQuery({
        queryKey: ["adminWebinars"],
        queryFn: adminWebinarsApi.getAll,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useAdminWebinarQuery = (id: string) => {
    return useQuery({
        queryKey: ["adminWebinar", id],
        queryFn: () => adminWebinarsApi.getOne(id),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!id,
    });
};

export const useCreateWebinarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateWebinarPayload) =>
            adminWebinarsApi.create(payload),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["adminWebinars"],
            });
            void queryClient.invalidateQueries({ queryKey: ["webinars"] });
        },
    });
};

export const useUpdateWebinarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateWebinarPayload;
        }) => adminWebinarsApi.update(id, payload),
        retry: false,
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: ["adminWebinars"],
            });
            void queryClient.invalidateQueries({
                queryKey: ["adminWebinar", variables.id],
            });
            void queryClient.invalidateQueries({ queryKey: ["webinars"] });
        },
    });
};

export const usePublishWebinarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminWebinarsApi.publish(id),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["adminWebinars"],
            });
            void queryClient.invalidateQueries({ queryKey: ["webinars"] });
        },
    });
};

export const useDeleteWebinarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminWebinarsApi.delete(id),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["adminWebinars"],
            });
            void queryClient.invalidateQueries({ queryKey: ["webinars"] });
        },
    });
};
