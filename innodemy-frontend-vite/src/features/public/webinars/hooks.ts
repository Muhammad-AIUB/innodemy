import { useQuery } from "@tanstack/react-query";
import { webinarsApi } from "./api";

export const useWebinarsQuery = () => {
    return useQuery({
        queryKey: ["webinars"],
        queryFn: webinarsApi.getWebinars,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60_000,
    });
};

export const useWebinarDetailQuery = (slug: string) => {
    return useQuery({
        queryKey: ["webinar", slug],
        queryFn: () => webinarsApi.getWebinarBySlug(slug),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!slug,
    });
};
