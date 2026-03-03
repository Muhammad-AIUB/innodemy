import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/authStore";
import { enrollmentsApi } from "./api";

export const useMyEnrollmentsQuery = () => {
    const token = useAuthStore((s) => s.token);

    return useQuery({
        queryKey: ["myEnrollments"],
        queryFn: enrollmentsApi.getMyEnrollments,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
        enabled: !!token,
    });
};
