import api from "../../../api/axios";
import type {
    CreateWebinarRegistrationPayload,
    WebinarRegistration,
} from "./types";

export const webinarRegistrationsApi = {
    register: async (
        payload: CreateWebinarRegistrationPayload,
    ): Promise<WebinarRegistration> => {
        const { data } = await api.post<{
            success: boolean;
            data: WebinarRegistration;
        }>("/webinar-registrations", payload);
        return data.data;
    },
};
