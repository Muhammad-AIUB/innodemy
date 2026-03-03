import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export const useDashboardStatsQuery = () => {
    return useQuery({
        queryKey: ["admin", "dashboard", "stats"],
        queryFn: dashboardApi.getStats,
        staleTime: 30 * 1000, // 30 seconds — dashboard data refreshes moderately
    });
};
