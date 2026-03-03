import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./api";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "./types";

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: categoriesApi.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCategoryQuery = (id: string) => {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => categoriesApi.getOne(id),
        enabled: !!id,
    });
};

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) =>
            categoriesApi.create(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateCategoryPayload;
        }) => categoriesApi.update(id, payload),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
            void queryClient.invalidateQueries({
                queryKey: ["category", variables.id],
            });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoriesApi.delete(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
};
