import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorsApi } from "./api";
import type { CreateInstructorPayload, UpdateInstructorPayload } from "./types";

export const useInstructorsQuery = () => {
    return useQuery({
        queryKey: ["instructors"],
        queryFn: instructorsApi.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useInstructorQuery = (id: string) => {
    return useQuery({
        queryKey: ["instructor", id],
        queryFn: () => instructorsApi.getOne(id),
        enabled: !!id,
    });
};

export const useCreateInstructorMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateInstructorPayload) =>
            instructorsApi.create(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["instructors"],
            });
        },
    });
};

export const useUpdateInstructorMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateInstructorPayload;
        }) => instructorsApi.update(id, payload),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: ["instructors"],
            });
            void queryClient.invalidateQueries({
                queryKey: ["instructor", variables.id],
            });
        },
    });
};

export const useToggleInstructorStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => instructorsApi.toggleStatus(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["instructors"],
            });
        },
    });
};

export const useDeleteInstructorMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => instructorsApi.delete(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["instructors"],
            });
        },
    });
};
