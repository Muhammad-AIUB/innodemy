import { useMutation } from "@tanstack/react-query";
import { webinarRegistrationsApi } from "./api";
import type { CreateWebinarRegistrationPayload } from "./types";

export const useRegisterWebinarMutation = () => {
    return useMutation({
        mutationFn: (payload: CreateWebinarRegistrationPayload) =>
            webinarRegistrationsApi.register(payload),
        retry: false,
    });
};
