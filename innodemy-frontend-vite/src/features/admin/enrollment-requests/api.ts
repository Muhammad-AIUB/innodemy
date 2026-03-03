import api from "../../../api/axios";
import type { EnrollmentRequestStatus } from "../../student/enrollment-requests/types";
import type { AdminEnrollmentRequest } from "./types";

export const adminEnrollmentRequestsApi = {
    getAll: async (
        status?: EnrollmentRequestStatus,
    ): Promise<AdminEnrollmentRequest[]> => {
        const { data } = await api.get<{
            success: boolean;
            data: AdminEnrollmentRequest[];
        }>("/admin/enrollment-requests", {
            params: status ? { status } : undefined,
        });
        return data.data;
    },

    approve: async (
        id: string,
        adminNote?: string,
    ): Promise<AdminEnrollmentRequest> => {
        const { data } = await api.patch<{
            success: boolean;
            data: AdminEnrollmentRequest;
        }>(`/admin/enrollment-requests/${id}/approve`, {
            adminNote: adminNote || undefined,
        });
        return data.data;
    },

    reject: async (
        id: string,
        adminNote?: string,
    ): Promise<AdminEnrollmentRequest> => {
        const { data } = await api.patch<{
            success: boolean;
            data: AdminEnrollmentRequest;
        }>(`/admin/enrollment-requests/${id}/reject`, {
            adminNote: adminNote || undefined,
        });
        return data.data;
    },
};
