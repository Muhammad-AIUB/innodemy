import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EnrollmentRequestStatus } from "../../student/enrollment-requests/types";
import { adminEnrollmentRequestsApi } from "./api";

export const useAdminEnrollmentRequestsQuery = (
    status?: EnrollmentRequestStatus,
) => {
    return useQuery({
        queryKey: ["adminEnrollmentRequests", status],
        queryFn: () => adminEnrollmentRequestsApi.getAll(status),
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useApproveEnrollmentRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
            adminEnrollmentRequestsApi.approve(id, adminNote),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["adminEnrollmentRequests"],
            });
        },
    });
};

export const useRejectEnrollmentRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
            adminEnrollmentRequestsApi.reject(id, adminNote),
        retry: false,
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: ["adminEnrollmentRequests"],
            });
        },
    });
};
