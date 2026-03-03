import api from "../../../api/axios";
import type {
    CreateEnrollmentRequestPayload,
    EnrollmentRequest,
} from "./types";

export const enrollmentRequestsApi = {
    create: async (
        payload: CreateEnrollmentRequestPayload,
    ): Promise<EnrollmentRequest> => {
        // If there's a file, send as multipart FormData
        if (payload.screenshotFile) {
            const formData = new FormData();
            formData.append("courseId", payload.courseId);
            formData.append("paymentMethod", payload.paymentMethod);
            formData.append("transactionId", payload.transactionId);
            formData.append("screenshot", payload.screenshotFile);

            const { data } = await api.post<{
                success: boolean;
                data: EnrollmentRequest;
            }>("/enrollment-requests", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data.data;
        }

        // Otherwise send as JSON with screenshotUrl
        const { screenshotFile: _, ...jsonPayload } = payload;
        const { data } = await api.post<{
            success: boolean;
            data: EnrollmentRequest;
        }>("/enrollment-requests", jsonPayload);
        return data.data;
    },
};
