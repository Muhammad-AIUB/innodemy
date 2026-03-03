import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/authStore";
import { registerApi } from "./api";
import type {
    CheckEmailPayload,
    SendOtpPayload,
    VerifyOtpPayload,
    RegisterPayload,
} from "./types";

export const useCheckEmailMutation = () => {
    return useMutation({
        mutationFn: (payload: CheckEmailPayload) =>
            registerApi.checkEmail(payload),
        retry: false,
    });
};

export const useSendOtpMutation = () => {
    return useMutation({
        mutationFn: (payload: SendOtpPayload) => registerApi.sendOtp(payload),
        retry: false,
    });
};

export const useVerifyOtpMutation = () => {
    return useMutation({
        mutationFn: (payload: VerifyOtpPayload) =>
            registerApi.verifyOtp(payload),
        retry: false,
    });
};

export const useRegisterMutation = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: (payload: RegisterPayload) => registerApi.register(payload),
        onSuccess: (data) => {
            setAuth(data.accessToken, data.user);
        },
        retry: false,
    });
};
