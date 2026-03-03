import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentRequestsApi } from "./api";
import type { CreateEnrollmentRequestPayload } from "./types";

export const useCreateEnrollmentRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateEnrollmentRequestPayload) =>
            enrollmentRequestsApi.create(payload),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["courseEnrollments"],
            });
            void queryClient.invalidateQueries({ queryKey: ["courses"] });
            void queryClient.invalidateQueries({
                queryKey: ["myEnrollments"],
            });
        },
    });
};
