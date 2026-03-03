import { useQuery } from "@tanstack/react-query";
import { adminWebinarRegistrationsApi } from "./api";

export const useAdminWebinarRegistrationsQuery = (webinarId: string) => {
    return useQuery({
        queryKey: ["webinarRegistrations", webinarId],
        queryFn: () => adminWebinarRegistrationsApi.getByWebinar(webinarId),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!webinarId,
    });
};
