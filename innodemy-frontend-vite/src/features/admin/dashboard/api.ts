import axios from "../../../api/axios";
import type { DashboardStats } from "./types";

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const { data } = await axios.get<{
            success: boolean;
            data: DashboardStats;
        }>("/admin/dashboard/stats");
        return data.data;
    },
};
