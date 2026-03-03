import api from "../../../api/axios";
import type {
    SendOtpPayload,
    SendOtpResponse,
    VerifyOtpPayload,
    VerifyOtpResponse,
    RegisterPayload,
    CheckEmailPayload,
    CheckEmailResponse,
} from "./types";
import type { AuthResponse } from "../../../types/auth.types";

export const registerApi = {
    checkEmail: async (
        payload: CheckEmailPayload,
    ): Promise<CheckEmailResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: CheckEmailResponse;
        }>("/auth/check-email", payload);
        return data.data;
    },

    sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: SendOtpResponse;
        }>("/auth/send-otp", payload);
        return data.data;
    },

    verifyOtp: async (
        payload: VerifyOtpPayload,
    ): Promise<VerifyOtpResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: VerifyOtpResponse;
        }>("/auth/verify-otp", payload);
        return data.data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await api.post<{
            success: boolean;
            data: AuthResponse;
        }>("/auth/register", payload);
        return data.data;
    },
};
